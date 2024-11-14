import { renderHook, act } from "@testing-library/react";
import { useUMLFormatter } from "../useUMLFormatter";

// Create a proper Storage mock
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string): string | null => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string): void => {
      store[key] = value;
    }),
    clear: jest.fn((): void => {
      store = {};
    }),
    removeItem: jest.fn((key: string): void => {
      delete store[key];
    }),
    key: jest.fn((index: number): string | null => {
      return Object.keys(store)[index] || null;
    }),
    get length(): number {
      return Object.keys(store).length;
    },
    [Symbol.iterator]: function* () {
      yield* Object.entries(store);
    },
  } as Storage;
})();

// Set the mock
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("useUMLFormatter", () => {
  const mockNodes = [
    {
      id: "1",
      type: "umlClass",
      data: {
        label: "TestClass",
        attributes: ["attr1: string", "attr2: number"],
        methods: ["method1()", "method2(param: string)"],
      },
    },
    {
      id: "2",
      type: "umlInterface",
      data: {
        label: "TestInterface",
        methods: ["method1()", "method2(param: string)"],
      },
    },
  ];

  const mockEdges = [
    {
      id: "e1",
      source: "1",
      target: "2",
      data: {
        edgeType: "curved-dashed",
      },
    },
    {
      id: "e2",
      source: "2",
      target: "1",
      data: {
        edgeType: "straight-solid",
      },
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it("should format UML data correctly from mockLocalStorage", async () => {
    // Arrange
    const problemId = "test-123";
    mockLocalStorage.setItem(
      `uml-diagram-nodes-${problemId}`,
      JSON.stringify(mockNodes)
    );
    mockLocalStorage.setItem(
      `uml-diagram-edges-${problemId}`,
      JSON.stringify(mockEdges)
    );

    // Act
    let formattedData: string = "";
    const { result } = renderHook(() => useUMLFormatter(problemId));

    await act(async () => {
      formattedData = result.current.getFormattedUMLData();
    });

    const parsedData = JSON.parse(formattedData);

    // Assert
    expect(parsedData.nodes[0]).toEqual({
      id: "1",
      type: "umlClass",
      label: "TestClass",
      attributes: ["attr1: string", "attr2: number"],
      methods: ["method1()", "method2(param: string)"],
    });

    expect(parsedData.nodes[1]).toEqual({
      id: "2",
      type: "umlInterface",
      label: "TestInterface",
      attributes: [], // Interface nodes don't have attributes in the component
      methods: ["method1()", "method2(param: string)"],
    });

    expect(parsedData.edges[0]).toEqual({
      id: "e1",
      source: "1",
      target: "2",
      type: "curved-dashed",
    });

    // Verify mockLocalStorage was called
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
      `uml-diagram-nodes-${problemId}`
    );
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
      `uml-diagram-edges-${problemId}`
    );
  });

  it("should handle empty mockLocalStorage", async () => {
    // Arrange
    const problemId = "test-123";

    // Act
    const { result } = renderHook(() => useUMLFormatter(problemId));
    let formattedData: string = "";

    await act(async () => {
      formattedData = result.current.getFormattedUMLData();
    });

    const parsedData = JSON.parse(formattedData);

    // Assert
    expect(parsedData).toEqual({
      nodes: [],
      edges: [],
    });
  });

  it("should prepare OpenAI prompt with correct format", async () => {
    // Arrange
    const problemId = "test-123";
    const userPrompt = "Analyze this diagram";
    mockLocalStorage.setItem(
      `uml-diagram-nodes-${problemId}`,
      JSON.stringify(mockNodes)
    );
    mockLocalStorage.setItem(
      `uml-diagram-edges-${problemId}`,
      JSON.stringify(mockEdges)
    );

    // Act
    const { result } = renderHook(() => useUMLFormatter(problemId));
    let prompt: string = "";

    await act(async () => {
      prompt = result.current.prepareOpenAIPrompt(userPrompt);
    });

    // Assert
    expect(prompt).toMatch(/User Prompt: Analyze this diagram/);
    expect(prompt).toMatch(/UML Diagram Data:/);
    expect(prompt).toMatch(/TestClass/);
  });
});
