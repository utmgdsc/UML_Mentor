import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { DrawIoEmbed, DrawIoEmbedRef} from 'react-drawio';
import { useLocation } from 'react-router-dom';


const CONFIG = {
    defaultEdgeStyle: {endSize: 12, startSize: 12, edgeStyle: "orthogonalEdgeStyle", rounded: 1, curved:0},
    enableCustomLibraries: false,
    appendCustomLibraries: false,
    expandLibraries: true, 
    defaultLibraries: "uml",
    override: false
}   


const Editor = () => {

    const drawioRef = useRef<DrawIoEmbedRef>(null);
    const diagramData = useRef<string | undefined>(undefined);
    //TODO: Allow the user to change the diagram name (super low proirity)
    const [diagramName, setDiagramName] = useState<string | null>(null);
    const diagramNameRef = useRef<string | null>(null); //Crutch for the handleSave function
    const diagramId = useRef<string | null>(null);

    function doExport() {
        if (drawioRef.current) {
            drawioRef.current.exportDiagram({
                format: 'xmlpng',
            });
        }
    };

    function useQuery() {
        const { search } = useLocation();
        return useMemo(() => new URLSearchParams(search), [search]);
    }

    const query = useQuery();


    //autosave (export) the diagram every 20 seconds (ONLY FOR DIAGRAMS IN PROGRESS, NOT EDITING EXISTING SOLUTIONS)
    useEffect(() => {
        if (query.get("type") !== "challenge") return;
        const interval = setInterval(() => {
            // console.log("autosaving");
            doExport();
        }, 20000);
        return () => { clearInterval(interval) };
    }, [query]);

    useEffect(() => {
        // If query.get("type") === "challenge" then we need to fetch the SolutionInProgress from the server
        // by challengeId and userId. If the SolutionInProgress exists, we need to load it into the editor (diagram + title).
        // Otherwise we create a new diagram + title, load it into the editor and make a SolutionInProgress entry in the db.
        if (query.get("type") === "challenge") {
            const challengeId = query.get("id");
            

            //fetch an existing diagram from the server and load it into the editor
            //If the diagram is not found, create a new diagram and save it to the server
            fetch("/api/inprogress/challenge/" + challengeId) //GET
            .then(response => { 
                if(response.status === 404) {
                    throw new Error("No diagram found for this challenge");
                }
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json() as Promise<{diagram: string, title: string, id: string}>
            })
            .then(data => {
                // console.log(data);
                diagramData.current = data.diagram;
                diagramId.current = data.id;
                setDiagramName(data.title);
                diagramNameRef.current = data.title; //Crutch for the handleSave function
                // console.log("Loaded diagram: " + diagramData.current + " with id: " + diagramId.current + " and name: " + diagramNameRef.current);
            })
            .catch((error: Error) => {
                console.log("Error: " + error.message);
                //if the solution in progress has not been created yet, create a new entry in the database
                if(error.message === "No diagram found for this challenge") {
                    //fetch the challenge details from the server to get the title
                    fetch("/api/challenges/" + challengeId).then(response => { //GET
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json() as Promise<{title: string}>
                    }).then(data => {
                        setDiagramName(data.title + " Diagram");
                        diagramNameRef.current = data.title + " Diagram"; //Crutch for the handleSave function
                        //create a new diagram and save it to the server
                        return fetch("/api/inprogress" , { //POST
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                title: diagramNameRef.current, 
                                challengeId: challengeId, 
                                xml: ""})
                        });
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json() as Promise<{id: string}>
                    }).then(data => {
                        // console.log("Created new diagram with id: " + data.id + " and title: " + data.title);
                        diagramId.current = data.id;
                    }).catch((error) => {
                        console.error(error);
                    });
                } else {
                    //otherwise, log the error
                    console.error(error);
                }
                
            });
        }   
        else if (query.get("type") === "solution") {
            //TODO: Load the existing solution diagram into the editor. Do not autosave it.

            // If query.get("type") === "solution" then we need to fetch the Solution from the server by solutionId.
            // We load the solution into the editor. The user can then confirm or drop changes.
            // Add a note for editing solution diagrams that it should only be used to add minor changes.
        } else {
            //Redirect to error page
            //TODO: implement this properly
            // return redirect("/error");
        }
    },[query] );


    /**
     * Save the diagram to the server by sending a PUT request to /api/solutions/inprogress with the diagram data.
     */
    const handleSave = useCallback((data: {event: string, xml: string, data: string, message: {exit?: boolean}}) => {
        //make sure to only process "export" events
        if (data.message.exit == true) return;

        const rawData = data.data;
        diagramData.current = rawData.substring(rawData.indexOf(",") + 1); //trim the data:image/png;base64, part

        if (diagramId.current !== null && diagramNameRef.current !== null) {
            // console.log("Saving diagram: " + diagramData.current + 
            // " with id: " + diagramId.current + 
            // " and name: " + diagramNameRef.current + 
            // "on event" + data.event);
            // console.log(data.message);

            fetch("/api/inprogress/" + diagramId.current, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    xml: diagramData.current, 
                    title: diagramNameRef.current, 
                    challengeId: query.get("id") //NOTE: This only works for challenges in progress
                }),
                keepalive: true // To allow saves when the tab is closed
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json() as Promise<{id: string}>
            })
            .then(data => {
                // console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    },[query, diagramName]);


    return (
        <div>
            <h1 className="h2">{diagramName}</h1>
            <div style={{height: "100vh"}}>
                < DrawIoEmbed 
                    ref={drawioRef}
                    configuration={CONFIG}
                    exportFormat="xmlpng"
                    urlParameters={
                        {
                            // ui: "atlas",
                            spin: true,
                            // modified: true,
                            // keepmodified: true,
                            libraries: true,
                            noSaveBtn: false,
                            saveAndExit: false,
                            noExitBtn: false
                        }
                    }
                    onExport={(data) => {handleSave(data)}} //Note: it says the type is wrong, but it is not. 
                    onSave={(data) => {
                        // console.log(data);
                        // If the save is triggered by another event, then do nothing
                        if(data.parentEvent !== "save") {
                            return;
                        }
                        doExport()
                    }}
                    onLoad={(data) => {
                        // If the xml is null, then we need to wait and reload the diagram from diagramData
                        if (data.xml === null) {
                            // console.log("Waiting for diagramData to be initialized");
                            setTimeout(() => {
                                if (drawioRef.current !== null && diagramData.current !== undefined){
                                    drawioRef.current?.load({
                                        xmlpng: diagramData.current
                                    });
                                    console.log("Loaded diagram from stash");
                                }
                                else {
                                    console.log("No diagram data found");
                                }
                            }, 10);
                        }  
                    }}
                    onClose={(data) => {
                        console.log(data);
                        // If the exit is triggered by another event, then do nothing
                        if(data.parentEvent || data.modified === true) {
                            return;
                        }
                        // Save and exit. Timeout to make sure the save request is sent before the tab is closed.
                        doExport();
                        setTimeout(() => {
                            window.close();
                        }, 1000);
                    }}
                    />
            </div>
            {/* TESTING ONLY
            <button onClick={ () => {
                if (drawioRef.current !== null && diagramData.current !== undefined){
                    drawioRef.current?.load({
                        xmlpng: diagramData.current
                    });
                    console.log("Loaded diagram from stash");
                }
                else {
                    console.log("No diagram data found");
                }
            }}>Import Diagram</button> */}
        </div>
    );
};

export default Editor;