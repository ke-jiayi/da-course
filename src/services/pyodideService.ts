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
  error?: PythonError;
}

export interface PythonError {
  type: string;
  message: string;
  lineNumber?: number;
  fileName?: string;
  details?: string;
}

export interface PyodideServiceConfig {
  cdnUrl?: string;
  packages?: string[];
  onLoading?: (message: string) => void;
  onError?: (error: Error) => void;
}

interface LoadingState {
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}

const DEFAULT_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
const DEFAULT_PACKAGES = ['pandas', 'numpy', 'matplotlib', 'scikit-learn'];

let pyodideInstance: any = null;
let loadingState: LoadingState = {
  isLoading: false,
  isReady: false,
  error: null
};

class PyodideService {
  private config: Required<PyodideServiceConfig>;
  private initPromise: Promise<any> | null = null;

  constructor(config: PyodideServiceConfig = {}) {
    this.config = {
      cdnUrl: config.cdnUrl || DEFAULT_CDN_URL,
      packages: config.packages || DEFAULT_PACKAGES,
      onLoading: config.onLoading || (() => {}),
      onError: config.onError || (() => {})
    };
  }

  private log(message: string): void {
    console.log(`[PyodideService] ${message}`);
    this.config.onLoading(message);
  }

  private handleError(error: Error): void {
    console.error(`[PyodideService] Error:`, error);
    this.config.onError(error);
  }

  private async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.loadPyodide) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)));
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      script.onload = () => {
        this.log('Pyodide 脚本加载成功');
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`无法从 CDN 加载 Pyodide，请检查网络连接\n\nCDN: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  private async loadPyodideCore(): Promise<any> {
    try {
      this.log('正在加载 Pyodide 核心库...');
      await this.loadScript(this.config.cdnUrl);
      
      this.log('正在初始化 Pyodide 运行时...');
      const indexURL = this.config.cdnUrl.replace('/pyodide.js', '/');
      
      const pyodide = await window.loadPyodide({
        indexURL,
        stdout: (msg: string) => this.log(msg),
        stderr: (msg: string) => console.error(`[Pyodide stderr] ${msg}`)
      });

      this.log('Pyodide 运行时初始化成功');
      return pyodide;
    } catch (error) {
      throw new Error(`Pyodide 核心加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async loadPackages(pyodide: any): Promise<void> {
    const packages = this.config.packages;
    this.log(`正在加载 Python 包: ${packages.join(', ')}...`);
    
    try {
      await pyodide.loadPackage(packages);
      this.log('所有 Python 包加载完成');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`包加载失败: ${message}\n\n建议: 检查网络连接后刷新页面重试`);
    }
  }

  private setupMatplotlib(pyodide: any): void {
    this.log('正在配置 Matplotlib...');
    
    pyodide.runPython(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from io import BytesIO

plt.rcParams['font.sans-serif'] = ['DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False
plt.ioff()

def show_plot():
    """将当前图表转换为 base64 编码的 HTML img 标签"""
    try:
        if not plt.get_fignums():
            return ''
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight', 
                    facecolor='white', edgecolor='none')
        buffer.seek(0)
        img_str = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close('all')
        return f'<img src="data:image/png;base64,{img_str}" style="max-width:100%;height:auto;margin-top:10px;border:1px solid #e5e7eb;border-radius:8px;" />'
    except Exception as e:
        plt.close('all')
        return f'<div style="color:#ef4444;padding:10px;">图表渲染错误: {str(e)}</div>'

def clear_plots():
    """清除所有图表"""
    plt.close('all')
`);
    
    this.log('Matplotlib 配置完成');
  }

  async initialize(): Promise<any> {
    if (loadingState.isReady && pyodideInstance) {
      return pyodideInstance;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInitialize();
    return this.initPromise;
  }

  private async doInitialize(): Promise<any> {
    loadingState.isLoading = true;
    loadingState.error = null;

    try {
      const pyodide = await this.loadPyodideCore();
      await this.loadPackages(pyodide);
      this.setupMatplotlib(pyodide);
      
      pyodideInstance = pyodide;
      loadingState.isReady = true;
      loadingState.isLoading = false;
      
      this.log('Pyodide 初始化完成');
      return pyodide;
    } catch (error) {
      loadingState.error = error instanceof Error ? error : new Error(String(error));
      loadingState.isLoading = false;
      this.handleError(loadingState.error);
      throw loadingState.error;
    }
  }

  async runPython(code: string): Promise<PythonExecutionResult> {
    if (!loadingState.isReady || !pyodideInstance) {
      try {
        await this.initialize();
      } catch (error) {
        return {
          success: false,
          stdout: '',
          stderr: '',
          error: {
            type: 'InitializationError',
            message: `Pyodide 初始化失败: ${error instanceof Error ? error.message : String(error)}`,
            details: '请检查网络连接后刷新页面重试'
          }
        };
      }
    }

    const py = pyodideInstance;

    try {
      py.runPython(`
import sys
from io import StringIO
_captured_stdout = StringIO()
_captured_stderr = StringIO()
_original_stdout = sys.stdout
_original_stderr = sys.stderr
sys.stdout = _captured_stdout
sys.stderr = _captured_stderr
      `);

      let result: any;
      let executionError: Error | null = null;

      try {
        result = await py.runPythonAsync(code);
      } catch (err: any) {
        executionError = err;
      }

      const stdout = py.runPython('_captured_stdout.getvalue()') || '';
      const stderr = py.runPython('_captured_stderr.getvalue()') || '';

      py.runPython(`
sys.stdout = _original_stdout
sys.stderr = _original_stderr
      `);

      if (executionError) {
        return this.parseError(executionError, stdout, stderr);
      }

      let output = stdout;
      if (stderr) {
        output += (output ? '\n' : '') + `[stderr]\n${stderr}`;
      }

      if (result !== undefined && result !== null) {
        const resultStr = this.formatResult(result);
        output += (output ? '\n' : '') + `>>> ${resultStr}`;
      }

      try {
        const hasPlots = py.runPython('len(plt.get_fignums()) > 0');
        if (hasPlots) {
          const plotHtml = py.runPython('show_plot()');
          if (plotHtml) {
            output += (output ? '\n\n' : '') + plotHtml;
          }
        }
      } catch (plotError) {
        console.warn('图表处理警告:', plotError);
      }

      return {
        success: true,
        output: output || '代码执行完成（无输出）',
        result,
        stdout,
        stderr
      };

    } catch (error: any) {
      return this.parseError(error, '', '');
    }
  }

  private formatResult(result: any): string {
    try {
      if (result === undefined) return 'None';
      if (result === null) return 'null';
      
      const resultType = typeof result;
      
      if (resultType === 'number' || resultType === 'boolean' || resultType === 'string') {
        return String(result);
      }

      if (resultType === 'object' && result !== null) {
        if (result.constructor?.name === 'JsProxy') {
          const strRepr = result.toString();
          if (strRepr !== '[object Object]') {
            return strRepr;
          }
        }
        
        if (Array.isArray(result)) {
          return JSON.stringify(result, null, 2);
        }
        
        try {
          return JSON.stringify(result, null, 2);
        } catch {
          return result.toString();
        }
      }
      
      return String(result);
    } catch {
      return String(result);
    }
  }

  private parseError(error: any, stdout: string, stderr: string): PythonExecutionResult {
    let errorType = 'Error';
    let errorMessage = '未知错误';
    let lineNumber: number | undefined;
    let details: string | undefined;

    if (error && typeof error === 'object') {
      errorType = error.type || error.name || 'Error';
      errorMessage = error.message || String(error);

      if (error.lineno !== undefined) {
        lineNumber = error.lineno;
      } else if (error.$lineno !== undefined) {
        lineNumber = error.$lineno;
      }

      if (error.filename) {
        details = `文件: ${error.filename}`;
        if (lineNumber !== undefined) {
          details += `\n行号: ${lineNumber}`;
        }
      }

      if (error.args && error.args.length > 1) {
        const extraInfo = error.args[1];
        if (extraInfo && typeof extraInfo === 'string' && extraInfo.includes('line')) {
          const lineMatch = extraInfo.match(/line (\d+)/);
          if (lineMatch && lineNumber === undefined) {
            lineNumber = parseInt(lineMatch[1], 10);
          }
        }
      }
    } else {
      errorMessage = String(error);
    }

    if (errorType === 'SyntaxError') {
      errorMessage = this.formatSyntaxError(errorMessage);
    } else if (errorType === 'IndentationError') {
      errorMessage = `缩进错误: ${errorMessage}`;
    } else if (errorType === 'NameError') {
      const match = errorMessage.match(/name '(\w+)' is not defined/);
      if (match) {
        errorMessage = `变量 "${match[1]}" 未定义，请检查是否拼写正确或已赋值`;
      }
    } else if (errorType === 'TypeError') {
      errorMessage = `类型错误: ${errorMessage}`;
    } else if (errorType === 'AttributeError') {
      errorMessage = `属性错误: ${errorMessage}`;
    } else if (errorType === 'ImportError' || errorType === 'ModuleNotFoundError') {
      errorMessage = `导入错误: ${errorMessage}`;
    } else if (errorType === 'ZeroDivisionError') {
      errorMessage = '数学错误: 除数不能为零';
    } else if (errorType === 'IndexError') {
      errorMessage = `索引错误: ${errorMessage}`;
    } else if (errorType === 'KeyError') {
      errorMessage = `键错误: ${errorMessage}`;
    } else if (errorType === 'ValueError') {
      errorMessage = `值错误: ${errorMessage}`;
    }

    const fullOutput: string[] = [];
    if (stdout) {
      fullOutput.push(`标准输出:\n${stdout}`);
    }
    if (stderr) {
      fullOutput.push(`标准错误:\n${stderr}`);
    }

    return {
      success: false,
      stdout,
      stderr,
      error: {
        type: errorType,
        message: errorMessage,
        lineNumber,
        details: details || (fullOutput.length > 0 ? fullOutput.join('\n\n') : undefined)
      }
    };
  }

  private formatSyntaxError(message: string): string {
    if (message.includes('EOF')) {
      return `语法错误: 代码不完整（意外的结束）\n提示: 检查括号、引号是否成对匹配`;
    }
    if (message.includes('EOL')) {
      return `语法错误: 字符串未正确关闭\n提示: 检查引号是否成对匹配`;
    }
    if (message.includes('invalid syntax')) {
      return `语法错误: ${message}\n提示: 检查关键字拼写、标点符号是否正确`;
    }
    return `语法错误: ${message}`;
  }

  isReady(): boolean {
    return loadingState.isReady;
  }

  isLoading(): boolean {
    return loadingState.isLoading;
  }

  getError(): Error | null {
    return loadingState.error;
  }

  async reset(): Promise<void> {
    pyodideInstance = null;
    loadingState = {
      isLoading: false,
      isReady: false,
      error: null
    };
    this.initPromise = null;
    this.log('Pyodide 服务已重置');
  }
}

const defaultService = new PyodideService();

export async function initPyodide(): Promise<any> {
  return defaultService.initialize();
}

export async function runPythonCode(code: string): Promise<PythonExecutionResult> {
  return defaultService.runPython(code);
}

export function isPyodideReady(): boolean {
  return defaultService.isReady();
}

export function isPyodideLoading(): boolean {
  return defaultService.isLoading();
}

export async function resetPyodide(): Promise<void> {
  await defaultService.reset();
}

export function createPyodideService(config?: PyodideServiceConfig): PyodideService {
  return new PyodideService(config);
}

export { PyodideService };
export default defaultService;
