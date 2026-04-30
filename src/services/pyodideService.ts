// 动态加载 Pyodide
declare global {
  interface Window {
    loadPyodide: any;
  }
}

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

let pyodide: any = null;

async function loadPyodideScript(): Promise<any> {
  if (!window.loadPyodide) {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Pyodide'));
      document.head.appendChild(script);
    });
  }
}

export async function initPyodide() {
  if (pyodide) return pyodide;
  try {
    await loadPyodideScript();
    pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    });
    await pyodide.loadPackage(['pandas', 'numpy', 'matplotlib', 'scikit-learn']);
    pyodide.runPython(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from io import BytesIO
plt.rcParams['axes.unicode_minus'] = False
plt.ioff()

def show_plot():
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()
    return f'<img src="data:image/png;base64,{img_str}" style="max-width:100%;margin-top:10px;" />'
    `);
    return pyodide;
  } catch (error) {
    console.error('Pyodide初始化失败:', error);
    throw error;
  }
}

export async function runPythonCode(code: string): Promise<PythonExecutionResult> {
  const py = await initPyodide();
  
  let stdout = '';
  let stderr = '';
  
  try {
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
      result = await py.runPythonAsync(code);
    } finally {
      stdout = py.runPython('captured_stdout.getvalue()') || '';
      stderr = py.runPython('captured_stderr.getvalue()') || '';
      py.runPython(`
sys.stdout = original_stdout
sys.stderr = original_stderr
      `);
    }
    
    let output = stdout;
    if (stderr) {
      output += '\n错误输出:\n' + stderr;
    }
    if (result !== undefined) {
      output += '\n返回值: ' + result;
    }
    
    try {
      const has_plots = py.runPython('len(plt.get_fignums()) > 0');
      if (has_plots) {
        const plot_html = py.runPython('show_plot()');
        output += '\n' + plot_html;
      }
    } catch (e) {
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
    const errorInfo = {
      type: error.name || 'Error',
      message: error.message || '未知错误',
      stack: error.stack,
      lineNumber: error.lineno
    };
    
    if (error.type) {
      errorInfo.type = error.type;
    }
    
    return { 
      success: false, 
      stdout,
      stderr,
      error: errorInfo
    };
  }
}

export async function runPython(code: string, outputElementId: string) {
  const outputElement = document.getElementById(outputElementId);
  if (!outputElement) {
    console.error(`Output element with id ${outputElementId} not found`);
    return;
  }
  
  outputElement.innerHTML = '<div class="text-gray-500">正在执行代码...</div>';
  
  try {
    console.log('开始执行Python代码:', code);
    const result = await runPythonCode(code);
    console.log('执行结果:', result);
    
    if (result.success) {
      let displayOutput = result.output || '';
      
      if (displayOutput && displayOutput.includes('<img')) {
        outputElement.innerHTML = displayOutput;
      } else {
        outputElement.innerHTML = `<pre class="text-sm">${displayOutput || '无输出'}</pre>`;
      }
    } else {
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
