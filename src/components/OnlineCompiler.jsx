import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Square, 
  Trash2, 
  Settings, 
  Moon, 
  Sun, 
  Code, 
  Terminal, 
  FileText, 
  Zap, 
  Wifi, 
  WifiOff,
  ChevronDown,
  Check,
  Download,
  Upload,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import axios from 'axios';

const DEFAULT_CODE = {
  javascript: `// JavaScript Example - Runs locally in browser\nfunction greetUser(name) {\n  console.log(\`Hello, \${name}! Welcome to our compiler.\`);\n  return \`Greeting sent to \${name}\`;\n}\n\n// Try interactive features\nconst result = greetUser('Developer');\nconsole.log(result);\n\n// You can use prompt() for input\nconst userInput = prompt("Enter your name:");\nif (userInput) {\n  console.log(\`Hello \${userInput}!\`);\n}`,
  python: `# Python Example - Runs on server\ndef fibonacci(n):\n    """Calculate fibonacci number at position n"""\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Get user input\ntry:\n    num = int(input("Enter number of fibonacci numbers to generate: "))\n    print(f"First {num} fibonacci numbers:")\n    for i in range(num):\n        print(f"F({i}) = {fibonacci(i)}")\nexcept ValueError:\n    print("Please enter a valid number")\nexcept:\n    # If no input provided, show example\n    print("Example: First 8 fibonacci numbers:")\n    for i in range(8):\n        print(f"F({i}) = {fibonacci(i)}")`,
  cpp: `// C++ Example - Runs on server\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <string>\n\nint main() {\n    std::cout << "C++ Sorting Demo" << std::endl;\n    \n    std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};\n    \n    std::cout << "Original array: ";\n    for(int num : numbers) {\n        std::cout << num << " ";\n    }\n    std::cout << std::endl;\n    \n    std::sort(numbers.begin(), numbers.end());\n    \n    std::cout << "Sorted array: ";\n    for(int num : numbers) {\n        std::cout << num << " ";\n    }\n    std::cout << std::endl;\n    \n    // Interactive input example\n    std::string name;\n    std::cout << "\\nEnter your name: ";\n    std::getline(std::cin, name);\n    \n    if (!name.empty()) {\n        std::cout << "Hello, " << name << "!" << std::endl;\n    } else {\n        std::cout << "Hello, Anonymous!" << std::endl;\n    }\n    \n    return 0;\n}`,
  java: `// Java Example - Runs on server\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n        System.out.println("Java Factorial Calculator");\n        System.out.println("=========================");\n        \n        try {\n            System.out.print("Enter a number to calculate factorial: ");\n            if (scanner.hasNextInt()) {\n                int n = scanner.nextInt();\n                if (n >= 0) {\n                    long factorial = calculateFactorial(n);\n                    System.out.println("Factorial of " + n + " is: " + factorial);\n                } else {\n                    System.out.println("Please enter a non-negative number");\n                }\n            } else {\n                // If no input, show example\n                System.out.println("No input provided. Showing example:");\n                int n = 5;\n                long factorial = calculateFactorial(n);\n                System.out.println("Factorial of " + n + " is: " + factorial);\n            }\n        } catch (Exception e) {\n            System.out.println("Example calculation:");\n            int n = 5;\n            long factorial = calculateFactorial(n);\n            System.out.println("Factorial of " + n + " is: " + factorial);\n        } finally {\n            scanner.close();\n        }\n    }\n    \n    public static long calculateFactorial(int n) {\n        if (n <= 1) return 1;\n        return n * calculateFactorial(n - 1);\n    }\n}`,
  c: `// C Example - Runs on server\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    printf("C Programming Demo\\n");\n    printf("==================\\n");\n    \n    // Array demonstration\n    int arr[] = {5, 2, 8, 1, 9, 4, 7};\n    int size = sizeof(arr) / sizeof(arr[0]);\n    \n    printf("Original array: ");\n    for(int i = 0; i < size; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n    \n    // Simple bubble sort\n    for(int i = 0; i < size-1; i++) {\n        for(int j = 0; j < size-i-1; j++) {\n            if(arr[j] > arr[j+1]) {\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n        }\n    }\n    \n    printf("Sorted array: ");\n    for(int i = 0; i < size; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n    \n    // Interactive input\n    char name[100];\n    printf("\\nEnter your name: ");\n    if(fgets(name, sizeof(name), stdin)) {\n        // Remove newline if present\n        name[strcspn(name, "\\n")] = 0;\n        if(strlen(name) > 0) {\n            printf("Hello, %s!\\n", name);\n        } else {\n            printf("Hello, Anonymous!\\n");\n        }\n    } else {\n        printf("Hello, World!\\n");\n    }\n    \n    return 0;\n}`,
  typescript: `// TypeScript Example - Runs locally in browser\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n}\n\nclass UserManager {\n  private users: User[] = [];\n\n  addUser(user: Omit<User, 'id'>): User {\n    const newUser: User = {\n      id: this.users.length + 1,\n      ...user\n    };\n    this.users.push(newUser);\n    console.log(\`Added user: \${newUser.name}\`);\n    return newUser;\n  }\n\n  getActiveUsers(): User[] {\n    return this.users.filter(user => user.isActive);\n  }\n\n  displayUsers(): void {\n    console.log('\\n=== User List ===');\n    this.users.forEach(user => {\n      console.log(\`\${user.id}. \${user.name} (\${user.email}) - \${user.isActive ? 'Active' : 'Inactive'}\`);\n    });\n  }\n}\n\n// Demo usage\nconst userManager = new UserManager();\n\nuserManager.addUser({\n  name: 'John Doe',\n  email: 'john@example.com',\n  isActive: true\n});\n\nuserManager.addUser({\n  name: 'Jane Smith',\n  email: 'jane@example.com',\n  isActive: false\n});\n\nuserManager.displayUsers();\n\nconst activeUsers = userManager.getActiveUsers();\nconsole.log(\`\\nActive users count: \${activeUsers.length}\`);`,
  go: `// Go Example - Runs on server\npackage main\n\nimport (\n    "fmt"\n    "sort"\n    "strings"\n)\n\ntype Person struct {\n    Name string\n    Age  int\n}\n\nfunc main() {\n    fmt.Println("Go Programming Demo")\n    fmt.Println("===================")\n    \n    // Slice operations\n    numbers := []int{64, 34, 25, 12, 22, 11, 90}\n    fmt.Printf("Original slice: %v\\n", numbers)\n    \n    sort.Ints(numbers)\n    fmt.Printf("Sorted slice: %v\\n", numbers)\n    \n    // Struct and methods\n    people := []Person{\n        {"Alice", 30},\n        {"Bob", 25},\n        {"Charlie", 35},\n    }\n    \n    fmt.Println("\\nPeople:")\n    for i, person := range people {\n        fmt.Printf("%d. %s (Age: %d)\\n", i+1, person.Name, person.Age)\n    }\n    \n    // String manipulation\n    text := "hello world golang programming"\n    words := strings.Fields(text)\n    fmt.Printf("\\nWords in text: %v\\n", words)\n    fmt.Printf("Capitalized: %s\\n", strings.Title(text))\n}`
};

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS', serverSide: false, color: 'bg-yellow-500', extension: '.js' },
  { value: 'typescript', label: 'TypeScript', icon: 'TS', serverSide: false, color: 'bg-blue-500', extension: '.ts' },
  { value: 'python', label: 'Python', icon: 'PY', serverSide: true, color: 'bg-green-500', extension: '.py' },
  { value: 'cpp', label: 'C++', icon: 'C++', serverSide: true, color: 'bg-purple-500', extension: '.cpp' },
  { value: 'java', label: 'Java', icon: 'JA', serverSide: true, color: 'bg-red-500', extension: '.java' },
  { value: 'c', label: 'C', icon: 'C', serverSide: true, color: 'bg-gray-500', extension: '.c' },
  { value: 'go', label: 'Go', icon: 'GO', serverSide: true, color: 'bg-cyan-500', extension: '.go' },
];

const CodingArena = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE['javascript']);
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [serverStatus, setServerStatus] = useState('unknown');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  // Check server status on mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Check if server is running
  const checkServerStatus = async () => {
    try {
      const response = await axios.get('https://complier-backend-1.onrender.com/health', { timeout: 2000 });
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  // Configure Monaco Editor
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Enhanced autocomplete and IntelliSense
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
    });

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });
  };

  // Handle language change
  const handleLanguageChange = (selectedLang) => {
    setLanguage(selectedLang);
    setCode(DEFAULT_CODE[selectedLang] || '');
    setOutput('');
    setUserInput('');
    setShowLanguageDropdown(false);
  };

  // Get current language info
  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.value === language);
  };

  // Execute code on server
  const executeOnServer = async (code, lang, input) => {
    try {
      setOutput('Connecting to server...\n');
      await checkServerStatus();
      
      if (serverStatus === 'offline') {
        throw new Error('Server is offline. Please try after some time.');
      }

      setOutput('Compiling and executing code...\n');
      
      const response = await axios.post('https://complier-backend-1.onrender.com/compile', {
        code: code,
        language: lang,
        input: input
      }, {
        timeout: 30000 // 30 second timeout
      });

      const result = response.data;
      let outputText = '';
      
      if (result.stdout) {
        outputText += result.stdout;
      }
      
      if (result.stderr) {
        outputText += '\n--- Errors/Warnings ---\n' + result.stderr;
      }
      
      if (!outputText.trim()) {
        outputText = 'Program executed successfully with no output.';
      }
      
      return outputText;
    } catch (error) {
      console.error('Server execution error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - code took too long to execute');
      } else if (error.response) {
        throw new Error(`Server error: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please try after some time.');
      } else {
        throw new Error(`Execution failed: ${error.message}`);
      }
    }
  };

  // Execute JavaScript locally
  const executeJavaScript = (code, input) => {
    return new Promise((resolve) => {
      let result = '';
      let inputLines = input.split('\n').filter(line => line.trim() !== '');
      let inputIndex = 0;
      
      // Create mock console and prompt
      const mockConsole = {
        log: (...args) => {
          result += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        },
        error: (...args) => {
          result += 'Error: ' + args.join(' ') + '\n';
        },
        warn: (...args) => {
          result += 'Warning: ' + args.join(' ') + '\n';
        }
      };

      const mockPrompt = (message) => {
        if (inputIndex < inputLines.length) {
          const response = inputLines[inputIndex++];
          result += `${message}${response}\n`;
          return response;
        }
        result += `${message}[No input provided]\n`;
        return null;
      };

      // Create a safe execution environment
      try {
        const wrappedCode = `
          (function() {
            const console = mockConsole;
            const prompt = mockPrompt;
            ${code}
          })();
        `;
        
        eval(wrappedCode);
        resolve(result.trim() || '[No output]');
      } catch (err) {
        resolve(`JavaScript Error: ${err.message}\n\nStack Trace:\n${err.stack}`);
      }
    });
  };

  // Main run code function
  const runCode = async () => {
    if (!code.trim()) {
      setOutput('Error: Please enter some code to execute.');
      return;
    }

    setIsRunning(true);
    setOutput('Initializing execution...\n');
    
    try {
      const currentLang = getCurrentLanguage();
      let result;

      if (currentLang.serverSide) {
        // Execute on server for C, C++, Python, Java, Go
        result = await executeOnServer(code, language, userInput);
      } else {
        // Execute locally for JavaScript/TypeScript
        result = await executeJavaScript(code, userInput);
      }
      
      setOutput(result);
    } catch (err) {
      setOutput(`Execution Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setUserInput('');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = () => {
    const currentLang = getCurrentLanguage();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${currentLang?.extension || '.txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE[language] || '');
    setOutput('');
    setUserInput('');
  };

  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const currentLang = getCurrentLanguage();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'vs-dark' 
        ? 'bg-slate-900' 
        : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`${
        theme === 'vs-dark' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      } border-b sticky top-0 z-50 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${theme === 'vs-dark' ? 'text-white' : 'text-slate-900'}`}>
                    Coding Arena
                  </h1>
                  <p className={`text-xs ${theme === 'vs-dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Multi-language code executor
                  </p>
                </div>
              </div>
              
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    theme === 'vs-dark' 
                      ? 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600' 
                      : 'bg-gray-100 text-slate-900 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center ${currentLang?.color}`}>
                    {currentLang?.icon}
                  </div>
                  <span className="text-sm font-medium">{currentLang?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showLanguageDropdown && (
                  <div className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                    theme === 'vs-dark' 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="py-2">
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => handleLanguageChange(lang.value)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
                            language === lang.value
                              ? theme === 'vs-dark'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-900'
                              : theme === 'vs-dark'
                                ? 'text-slate-300 hover:bg-slate-700'
                                : 'text-slate-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center ${lang.color}`}>
                            {lang.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{lang.label}</div>
                            <div className={`text-xs ${
                              language === lang.value
                                ? theme === 'vs-dark' ? 'text-blue-200' : 'text-blue-600'
                                : theme === 'vs-dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {lang.serverSide ? 'Server' : 'Browser'} • {lang.extension}
                            </div>
                          </div>
                          {language === lang.value && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Server Status */}
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                serverStatus === 'online' 
                  ? 'bg-green-100 text-green-700' 
                  : serverStatus === 'offline'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
              }`}>
                {serverStatus === 'online' ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                <span>
                  {serverStatus === 'online' ? 'Connected' : serverStatus === 'offline' ? 'Offline' : 'Unknown'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={copyCode}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'vs-dark' 
                      ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={downloadCode}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'vs-dark' 
                      ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                  title="Download Code"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={resetCode}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'vs-dark' 
                      ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                  title="Reset to Template"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'vs-dark' 
                      ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'vs-dark' 
                      ? 'text-yellow-400 hover:bg-slate-700' 
                      : 'text-slate-600 hover:bg-gray-100'
                  }`}
                  title="Toggle Theme"
                >
                  {theme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg transition-colors ${
                    showSettings
                      ? 'bg-blue-600 text-white'
                      : theme === 'vs-dark' 
                        ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                        : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Run Button */}
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                  isRunning
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Running</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run</span>
                  </>
                )}
              </button>
              
              <button
                onClick={clearOutput}
                className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`mt-4 p-4 rounded-lg border ${
              theme === 'vs-dark' 
                ? 'bg-slate-700/50 border-slate-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <label className={`text-sm font-medium ${
                      theme === 'vs-dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Font Size:
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme === 'vs-dark' ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-slate-700'
                    }`}>
                      {fontSize}px
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 text-sm ${
                    theme === 'vs-dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <span>Runtime:</span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      currentLang?.serverSide 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {currentLang?.serverSide ? 'Server' : 'Browser'}
                    </div>
                  </div>
                </div>
                
                <div className={`text-xs ${theme === 'vs-dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Press Ctrl+Enter to execute code
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto p-4 ${isFullscreen ? 'h-screen' : ''}`}>
        <div className={`grid gap-4 ${isFullscreen ? 'h-full' : 'h-[calc(100vh-160px)]'} ${
          isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'
        }`}>
          {/* Code Editor */}
          <div className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-2'} rounded-lg shadow-lg overflow-hidden ${
            theme === 'vs-dark' 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              theme === 'vs-dark' ? 'bg-slate-750 border-slate-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center ${currentLang?.color}`}>
                  {currentLang?.icon}
                </div>
                <div>
                  <span className={`font-medium ${theme === 'vs-dark' ? 'text-white' : 'text-slate-900'}`}>
                    {currentLang?.label} Editor
                  </span>
                  <div className={`text-xs flex items-center space-x-2 ${
                    theme === 'vs-dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <span>{currentLang?.extension}</span>
                    <span>•</span>
                    <span>{currentLang?.serverSide ? 'Server execution' : 'Browser execution'}</span>
                  </div>
                </div>
              </div>
              
              <div className={`text-xs ${theme === 'vs-dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Ctrl+Enter to run
              </div>
            </div>
            
            <div className="h-full">
              <Editor
                height={`calc(100% - 60px)`}
                language={language === 'cpp' ? 'cpp' : language}
                theme={theme}
                value={code}
                onChange={setCode}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: fontSize,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                  minimap: { enabled: window.innerWidth > 1200 },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  selectOnLineNumbers: true,
                  readOnly: false,
                  cursorStyle: 'line',
                  contextmenu: true,
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  }
                }}
              />
            </div>
          </div>

          {/* Input/Output Panel */}
          {!isFullscreen && (
            <div className="space-y-4">
              {/* Input Panel */}
              <div className={`rounded-lg shadow-lg overflow-hidden ${
                theme === 'vs-dark' 
                  ? 'bg-slate-800 border border-slate-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className={`px-4 py-2 border-b flex items-center ${
                  theme === 'vs-dark' ? 'bg-slate-750 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  <span className={`font-medium text-sm ${theme === 'vs-dark' ? 'text-white' : 'text-slate-900'}`}>
                    Input
                  </span>
                  <span className={`text-xs ml-2 ${theme === 'vs-dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    ({currentLang?.serverSide ? 'stdin' : 'prompt responses'})
                  </span>
                </div>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={currentLang?.serverSide 
                    ? "Enter input for your program (each line will be sent to stdin)..." 
                    : "Enter responses for JavaScript prompt() calls (one per line)..."
                  }
                  className={`w-full h-24 p-3 resize-none border-0 focus:outline-none bg-transparent text-sm ${
                    theme === 'vs-dark' 
                      ? 'text-slate-300 placeholder-slate-500' 
                      : 'text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Output Panel */}
              <div className={`rounded-lg shadow-lg overflow-hidden flex-1 ${
                theme === 'vs-dark' 
                  ? 'bg-slate-800 border border-slate-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className={`px-4 py-2 border-b flex items-center justify-between ${
                  theme === 'vs-dark' ? 'bg-slate-750 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center">
                    <Terminal className="w-4 h-4 mr-2 text-green-500" />
                    <span className={`font-medium text-sm ${theme === 'vs-dark' ? 'text-white' : 'text-slate-900'}`}>
                      Output
                    </span>
                  </div>
                  {isRunning && (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-green-500 font-medium">Running</span>
                    </div>
                  )}
                </div>
                <div className={`relative h-64 ${
                  theme === 'vs-dark' ? 'bg-slate-900/30' : 'bg-gray-50/50'
                }`}>
                  <pre className={`absolute inset-0 p-3 overflow-auto text-sm whitespace-pre-wrap font-mono leading-relaxed ${
                    theme === 'vs-dark' 
                      ? 'text-slate-300' 
                      : 'text-slate-800'
                  }`}>
                    {output || (
                      <div className={`${theme === 'vs-dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            currentLang?.serverSide && serverStatus === 'offline' 
                              ? 'bg-red-400' 
                              : 'bg-green-400'
                          }`}></div>
                          <span>
                            Ready to execute {currentLang?.label} code
                          </span>
                        </div>
                        <div className="text-xs space-y-1 ml-4">
                          <div>• Click "Run" or press Ctrl+Enter to execute</div>
                          <div>• Use the input panel above for program input</div>
                          <div>• Output and errors will appear here</div>
                          {currentLang?.serverSide && serverStatus === 'offline' && (
                            <div className="text-red-400 mt-2">
                              ⚠️ Server is offline. Please try again later.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </pre>
                  {isRunning && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                      <div className={`px-4 py-2 rounded-lg ${
                        theme === 'vs-dark' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-800 border border-slate-200'
                      } shadow-lg`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Executing code...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`mt-4 p-3 rounded-lg ${
          theme === 'vs-dark' 
            ? 'bg-slate-800/50 border border-slate-700' 
            : 'bg-white/50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center space-x-4 ${
              theme === 'vs-dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  serverStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span>
                  <strong>{currentLang?.label}</strong> • 
                  {currentLang?.serverSide ? ' Server-side execution' : ' Browser-side execution'}
                </span>
              </div>
            </div>
            <div className={`text-xs ${theme === 'vs-dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              Coding Arena • by Narendra Singh (Founder)
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {showLanguageDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLanguageDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default CodingArena;