import { loadPyodide } from 'pyodide';

// 全局Pyodide实例
let pyodide: any = null;

// 初始化Pyodide，预装所需库
export async function initPyodide() {
  if (pyodide) return pyodide;
  try {
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/'
    });
    // 预装核心库 - 只加载Pyodide支持的包
    await pyodide.loadPackage([
      'pandas', 'numpy', 'matplotlib', 'scikit-learn'
    ]);
    // 配置matplotlib，使其在前端渲染
    pyodide.runPython(`
      import matplotlib.pyplot as plt
      plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
      plt.ioff()
    `);
    return pyodide;
  } catch (error) {
    console.error('Pyodide初始化失败:', error);
    throw error;
  }
}

// 运行Python代码
export async function runPythonCode(code: string) {
  const py = await initPyodide();
  try {
    // 保存原始输出
    let stdout = '';
    let stderr = '';
    
    // 使用Pyodide的sys.stdout和sys.stderr重定向
    py.runPython(`
      import sys
      from io import StringIO
      
      original_stdout = sys.stdout
      original_stderr = sys.stderr
      
      sys.stdout = captured_stdout = StringIO()
      sys.stderr = captured_stderr = StringIO()
    `);
    
    let result;
    try {
      // 执行用户代码
      result = await py.runPythonAsync(code);
    } finally {
      // 获取捕获的输出
      stdout = py.runPython('captured_stdout.getvalue()') || '';
      stderr = py.runPython('captured_stderr.getvalue()') || '';
      
      // 恢复原始输出
      py.runPython(`
        sys.stdout = original_stdout
        sys.stderr = original_stderr
      `);
    }
    
    // 构建输出
    let output = stdout;
    if (stderr) {
      output += '\n错误输出:\n' + stderr;
    }
    if (result !== undefined) {
      output += '\n返回值: ' + result;
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
    console.log('开始执行Python代码:', code);
    const result = await runPythonCode(code);
    console.log('执行结果:', result);
    if (result.success) {
      // 检查输出是否包含HTML
      if (result.output && result.output.includes('<img')) {
        // 直接设置为HTML内容
        outputElement.innerHTML = result.output;
      } else {
        // 否则使用pre标签
        outputElement.innerHTML = `<pre class="text-sm">${result.output || '无输出'}</pre>`;
      }
    } else {
      const errorMsg = result.error || '未知错误';
      console.error('代码执行错误:', errorMsg);
      outputElement.innerHTML = `<pre class="text-red-500">错误: ${errorMsg}</pre>`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('执行错误:', errorMessage);
    outputElement.innerHTML = `<pre class="text-red-500">执行错误: ${errorMessage || '未知错误'}</pre>`;
  }
}
