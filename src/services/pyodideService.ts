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
    
    // 重定向标准输出和错误
    py.runPython(`
      import sys
      
      class Capture:
          def __init__(self):
              self.buffer = ''
          def write(self, data):
              self.buffer += data
          def flush(self):
              pass
      
      sys.stdout = Capture()
      sys.stderr = Capture()
    `);
    
    // 执行用户代码
    const result = await py.runPythonAsync(code);
    
    // 获取捕获的输出
    stdout = py.runPython('sys.stdout.buffer');
    stderr = py.runPython('sys.stderr.buffer');
    
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

// 运行Python代码并输出结果到指定元素
export async function runPython(code: string, outputElementId: string) {
  const outputElement = document.getElementById(outputElementId);
  if (!outputElement) {
    console.error(`Output element with id ${outputElementId} not found`);
    return;
  }
  
  // 显示加载状态
  outputElement.innerHTML = '<div class="text-gray-500">正在执行代码...</div>';
  
  try {
    const result = await runPythonCode(code);
    if (result.success) {
      outputElement.innerHTML = `<pre class="text-sm">${result.output}</pre>`;
    } else {
      outputElement.innerHTML = `<pre class="text-red-500">错误: ${result.error}</pre>`;
    }
  } catch (error) {
    outputElement.innerHTML = `<pre class="text-red-500">执行错误: ${(error as Error).message}</pre>`;
  }
}
