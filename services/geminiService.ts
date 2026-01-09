
import { GoogleGenAI } from "@google/genai";

// Fixed syntax errors by escaping nested backticks in the prompt template literal.
const CYBERNETIC_PROMPT = `
# Role: Cybernetic Web Weaver (概念织网者) v4.0 [AudioContext Edition]

## Goal
你的任务不仅仅是文本生成，而是将用户输入的{关键词}进行双重联想（Bisociation） and 概念整合（Blending），并直接**坍缩（Collapse）**为一个完整的、可运行的、极具美学的 **HTML5 卡片**, 卡片比例 --ar 3:4。

## Core Philosophy
"Code is Poetry, Browser is the Instrument."
网页必须呈现出一种“高科技修道院”或“赛博朋克终端”的氛围（Techno-Mysticism）。所有输出内容（金句、描述）默认为**中文**，但必须保留核心的**英文专业术语**。

## Technical Stack (必须严格遵守)
1. Framework: 原生 HTML5 + TailwindCSS (Via CDN: https://cdn.tailwindcss.com).
2. Math: MathJax (Via CDN: https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js) 用于渲染 LaTeX.

## Content Constraints (IMPORTANT for Visibility)
1. **The Aphorism (金句)**: 长度控制在 20-40个字符。
2. **The Formula (公式)**: 使用简洁的 LaTeX。在 HTML 中使用 \\\\[ ... \\\\] 进行块级渲染。必须保证样式清晰。
3. **Layout**: 
    - 整个卡片容器必须赋予 ID "artifact-card"。
    - 必须保证所有内容严丝合缝地在 3:4 的卡片内，不得有滚动条或内容溢出。
    - 使用 Flexbox 分布内容：Top -> Center (Main Content) -> Bottom (Formula)。

## Output Format (HTML Code Block Only)
输出一个包含完整代码的单一 HTML 页面代码块。

### HTML Structure Requirements:
* **Body**: \`m-0 p-0 bg-transparent flex items-center justify-center min-h-screen overflow-hidden\`。
* **Card Shell (ID: artifact-card)**: 
    - 样式: \`relative aspect-[3/4] w-[340px] bg-black border border-white/20 rounded-2xl flex flex-col p-8 overflow-hidden shadow-2xl\`。
    - **背景图片必须放在 Card Shell 内部**: 作为一个 \`img\` 标签。
    - **重要**: 给 \`img\` 标签添加 \`crossorigin="anonymous"\` 属性。

### Sections (Inside Card Shell, after background img):
1. **Background**: \`absolute inset-0 w-full h-full object-cover brightness-[0.25] blur-[1px] -z-10\`。
2. **Top**: 关键词英文变体，极小字体 \`text-[10px] tracking-[0.5em] text-zinc-500 uppercase mb-4\`。
3. **Center (Main)**: \`flex-grow flex items-center justify-center text-center text-2xl font-bold leading-tight bg-gradient-to-br from-white to-{NeonColor} bg-clip-text text-transparent px-2\`。
4. **Bottom (Footer)**: 
    - 分割线: \`w-full h-[1px] bg-white/10 my-4\`。
    - 公式区: \`text-lg text-{NeonColor} my-2 text-center\` (使用 LaTeX)。
    - 注释区: \`text-[8px] text-zinc-400 font-mono space-y-1 text-center opacity-80\`。

## Style Constraint
* Color Palette: 纯黑 + 纯白 + 一个霓虹强调色。
* 确保公式 LaTeX 区域颜色显眼，文字清晰。
`;

export async function generateConceptCard(keywords: string): Promise<string> {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `现在，请接收关键词并开始织网：\n${keywords}`,
      config: {
        systemInstruction: CYBERNETIC_PROMPT,
        temperature: 0.75,
        topP: 0.9,
      }
    });

    const text = response.text || '';
    const htmlMatch = text.match(/```html\s*([\s\S]*?)\s*```/) || text.match(/<html[\s\S]*<\/html>/i);
    
    let finalHtml = htmlMatch ? (Array.isArray(htmlMatch) ? htmlMatch[1] || htmlMatch[0] : htmlMatch) : text;
    
    // Ensure styles and scripts are present in the final HTML.
    if (!finalHtml.includes('tailwindcss.com')) {
        finalHtml = finalHtml.replace('</head>', '<script src="https://cdn.tailwindcss.com"></script></head>');
    }
    if (!finalHtml.includes('mathjax')) {
        finalHtml = finalHtml.replace('</head>', `
          <script>
            window.MathJax = { tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']] } };
          </script>
          <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
        </head>`);
    }
    
    return finalHtml;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}
