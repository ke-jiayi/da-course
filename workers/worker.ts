// worker.ts
export default {
  async fetch(request: Request, env: Env) {
    // 只允许POST请求
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      // 接收前端请求数据（用户消息）
      const { messages } = await request.json();
      
      // 拼接系统提示词（AI规范）
      const systemPrompt = {
        role: 'system',
        content: `你是一个严格的Python数据分析教练，你的任务是帮助用户通过实操项目学习数据分析，而不是替他们写代码。
1. 永远不要直接给用户完整的可运行代码，只给思路和关键代码片段；
2. 当用户代码报错时，先指出错误原因，再告诉他们应该怎么改，不要直接贴修正后的代码；
3. 当用户说"我卡住了"时，给他们一个下一步的提示，引导他们自己思考；
4. 当用户答错题目时，一定要先追问："你哪里错了？漏掉了什么？"，然后再详细解释；
5. 始终强调思维的重要性，而不是语法的正确性；
6. 语言要简洁、直白、严厉，不要太客气。`
      };

      // 转发请求到AI Gateway
      const aiResponse = await fetch(
        `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/${env.AI_GATEWAY_NAME}/openai/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini', // 轻量模型，适配免费额度
            messages: [systemPrompt, ...messages],
            temperature: 0.7,
            max_tokens: 500
          })
        }
      );

      // 返回AI响应
      return new Response(aiResponse.body, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'AI请求失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// 环境变量定义（Cloudflare Workers中配置）
interface Env {
  CLOUDFLARE_ACCOUNT_ID: string;
  AI_GATEWAY_NAME: string;
  AI_API_KEY: string;
}
