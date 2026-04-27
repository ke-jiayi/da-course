import { loadPyodide } from 'pyodide';

// 定义返回结果的类型
export interface PythonExecutionResult {
  success: boolean;
  output?: string;
  result?: any;
  stdout: string;
  stderr: string;
  error?: {
    type: string;
    message: string;
    stack?: string;
    lineNumber?: number;
  };
}

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
      import base64
      from io import BytesIO
      plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
      plt.rcParams['axes.unicode_minus'] = False
      plt.ioff()
      
      # 定义一个函数来将图表转换为base64编码的图像
      def show_plot():
          buffer = BytesIO()
          plt.savefig(buffer, format='png')
          buffer.seek(0)
          img_str = base64.b64encode(buffer.read()).decode('utf-8')
          plt.close()
          return f'<img src="data:image/png;base64,{img_str}" />'
    `);
    return pyodide;
  } catch (error) {
    console.error('Pyodide初始化失败:', error);
    throw error;
  }
}

// 运行Python代码
export async function runPythonCode(code: string): Promise<PythonExecutionResult> {
  const py = await initPyodide();
  
  let stdout = '';
  let stderr = '';
  
  try {
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
    
    // 检查是否有matplotlib图表需要显示
    try {
      const has_plots = py.runPython('len(plt.get_fignums()) > 0');
      if (has_plots) {
        const plot_html = py.runPython('show_plot()');
        output += '\n' + plot_html;
      }
    } catch (e) {
      // 忽略图表显示错误
      console.log('图表显示错误:', e);
    }
    
    return { 
      success: true, 
      output, 
      result,
      stdout,
      stderr
    };
  } catch (error: any) {
    // 获取详细的错误信息
    const errorInfo = {
      type: error.name || 'Error',
      message: error.message || '未知错误',
      stack: error.stack,
      lineNumber: error.lineno
    };
    
    // 尝试获取 Pyodide 特有的错误信息
    if (error.type) {
      errorInfo.type = error.type;
    }
    
    // 确保在错误时也返回 stdout 和 stderr
    return { 
      success: false, 
      stdout,
      stderr,
      error: errorInfo
    };
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
      // 构建输出内容，包含stdout、stderr和返回值
      let displayOutput = result.output || '';
      
      // 检查输出是否包含HTML
      if (displayOutput && displayOutput.includes('<img')) {
        // 直接设置为HTML内容
        outputElement.innerHTML = displayOutput;
      } else {
        // 否则使用pre标签
        outputElement.innerHTML = `<pre class="text-sm">${displayOutput || '无输出'}</pre>`;
      }
    } else {
      // 构建详细的错误信息
      let errorDisplay = '';
      
      if (result.stdout) {
        errorDisplay += `标准输出:\n${result.stdout}\n\n`;
      }
      
      if (result.stderr) {
        errorDisplay += `标准错误:\n${result.stderr}\n\n`;
      }
      
      if (result.error) {
        errorDisplay += `错误类型: ${result.error.type}\n`;
        errorDisplay += `错误信息: ${result.error.message}`;
        if (result.error.lineNumber !== undefined) {
          errorDisplay += `\n行号: ${result.error.lineNumber}`;
        }
        if (result.error.stack) {
          errorDisplay += `\n\n堆栈跟踪:\n${result.error.stack}`;
        }
      }
      
      console.error('代码执行错误:', result.error);
      outputElement.innerHTML = `<pre class="text-red-500">错误:\n${errorDisplay || '未知错误'}</pre>`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('执行错误:', errorMessage);
    outputElement.innerHTML = `<pre class="text-red-500">执行错误: ${errorMessage || '未知错误'}</pre>`;
  }
}
