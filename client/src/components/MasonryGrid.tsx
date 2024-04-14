import { useEffect, useState, ReactNode, useCallback } from "react";

interface ContainerProps {
    children: ReactNode[];
    xxl?: number;
    xl?: number;
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    className?: string;
}

/**
 * Component that creates a masonry grid layout. 
 * The number of columns is determined by the width of the container and the props passed to the component.
 * Children are placed in columns left to right, top to bottom. 
 * Meaning that the first child will be at the top of the first column, 
 * the second child will be at the top of the second column, and so on.
 * @param param0 
 * @returns 
 */
const MasonryGrid = ({children, xxl, xl, lg, md, sm, xs, className} : ContainerProps) => {
    // make a classname string based on the props
    const makeClassName = () => {
      let gridClassName = "masonry-grid";
      if (xxl) gridClassName += ` xxl-${xxl}`;
      if (xl) gridClassName += ` xl-${xl}`;
      if (lg) gridClassName += ` lg-${lg}`;
      if (md) gridClassName += ` md-${md}`;
      if (sm) gridClassName += ` sm-${sm}`;
      if (xs) gridClassName += ` xs-${xs}`;
      return gridClassName += " " + className;
    };

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => { setWidth(window.innerWidth); };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const makeGrid = useCallback(() => {
        // determine the number of columns based on the width
        let columns = 1;
        if (width >= 1400 && xxl) columns = xxl;
        else if (width >= 1200 && xl) columns = xl;
        else if (width >= 992 && lg) columns = lg;
        else if (width >= 768 && md) columns = md;
        else if (width >= 576 && sm) columns = sm;
        else if (xs) columns = xs;


        // create an array of arrays to hold the children
        const grid = Array(columns).fill(null).map(() => [] as ReactNode[]);

        // loop through the children and add them to the shortest column
        for (let i = 0; i < children.length; i++) {
            const column = i % columns;
            grid[column].push(children[i]);
        }

        // map each column to a div
        return grid.map((column, index) => (
            <div key={index} className="masonry-column">
                {/* // map each child to a div */}
                {column.map((child, index) => (
                    <div key={index} className="mt-4 masonry-item">
                        {child}
                    </div>
                ))}
            </div>
        ));
    }, [children, width, xxl, xl, lg, md, sm, xs]);

    return (
      <div className={makeClassName()}>
        {makeGrid()}
      </div>
    );
  };
  
  export default MasonryGrid;