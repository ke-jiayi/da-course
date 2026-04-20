import { loadPyodide } from 'pyodide';

// 全局Pyodide实例
let pyodide: any = null;

// 初始化Pyodide，预装所需库
export async function initPyodide() {
  if (pyodide) return pyodide;
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
  });
  // 预装核心库
  await pyodide.loadPackage([
    'pandas', 'numpy', 'matplotlib', 'seaborn', 'scikit-learn', 'mlxtend'
  ]);
  // 配置matplotlib，使其在前端渲染
  pyodide.runPython(`
    import matplotlib.pyplot as plt
    plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
    plt.ioff()
  `);
  return pyodide;
}

// 运行Python代码
export async function runPythonCode(code: string) {
  const py = await initPyodide();
  try {
    // 捕获标准输出
    let stdout = '';
    let stderr = '';
    
    // 重定向标准输出
    py.setStdout((text: string) => {
      stdout += text;
    });
    
    // 重定向标准错误
    py.setStderr((text: string) => {
      stderr += text;
    });
    
    // 执行代码
    const result = await py.runPythonAsync(code);
    
    // 构建输出
    let output = stdout;
    if (stderr) {
      output += '\n错误输出:\n' + stderr;
    }
    
    return { success: true, output, result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
