import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from prompts.jargon_prompt import jargon_few_shot_prompt

load_dotenv()

class JargonTranslation(BaseModel):
    easyDefinition: str = Field(description="초등학생도 이해할 수 있는 쉬운 용어 설명")
    businessImpact: str = Field(description="이 용어가 프로젝트 일정이나 협업에 미치는 영향")

def get_llm():
    # Anthropic 우선 순위 (계획서 준수), 없으면 OpenAI
    if os.getenv("ANTHROPIC_API_KEY"):
        return ChatAnthropic(model="claude-3-haiku-20240307", temperature=0)
    else:
        return ChatOpenAI(model="gpt-4o-mini", temperature=0)

def create_jargon_chain():
    llm = get_llm()
    parser = JsonOutputParser(pydantic_object=JargonTranslation)
    
    # 프롬프트에 JSON 형식을 유도하는 지침 추가
    format_instructions = parser.get_format_instructions()
    
    # 융합된 프롬프트 (Few-shot + JSON format)
    # 힌트: Few-shot suffix를 JSON 요구사항을 포함하도록 확장
    custom_suffix = jargon_few_shot_prompt.suffix + "\n\n반드시 아래 형식을 지켜주세요:\n{format_instructions}"
    
    jargon_few_shot_prompt.suffix = custom_suffix
    jargon_few_shot_prompt.input_variables.append("format_instructions")
    
    chain = jargon_few_shot_prompt | llm | parser
    return chain

# 싱글톤 패턴으로 체인 인스턴스 관리
jargon_chain = create_jargon_chain()

def translate_jargon(term: str, role: str):
    from langchain_core.output_parsers import JsonOutputParser
    parser = JsonOutputParser(pydantic_object=JargonTranslation)
    format_instructions = parser.get_format_instructions()
    
    return jargon_chain.invoke({
        "term": term, 
        "role": role,
        "format_instructions": format_instructions
    })
