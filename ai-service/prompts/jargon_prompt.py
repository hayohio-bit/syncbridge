from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate

# Few-shot 예시 데이터
examples = [
    {
        "term": "API", 
        "role": "GENERAL", 
        "translation": "서로 다른 프로그램들이 정보를 주고받기 위해 사용하는 '약속된 통로'입니다. 예를 들어, 기상청 앱이 내 폰으로 날씨 정보를 보내줄 때 사용하는 창구와 같습니다."
    },
    {
        "term": "API", 
        "role": "DESIGNER", 
        "translation": "디자인 시안에 있는 데이터들이 실제 화면에 어떻게 뿌려질지 결정하는 '데이터 명세서'입니다. 어떤 이미지가 들어오고 어떤 텍스트가 표시될지 개발자와 소통하는 규칙입니다."
    },
    {
        "term": "API", 
        "role": "DEVELOPER", 
        "translation": "어플리케이션 간 상호작용을 위한 인터페이스입니다. RESTful 설계 원칙에 따라 JSON 형태의 리소스를 CRUD(Create, Read, Update, Delete) 할 수 있는 엔드포인트들의 집합입니다."
    },
    {
        "term": "Docker",
        "role": "GENERAL",
        "translation": "프로그램을 실행하는 데 필요한 모든 것을 하나로 묶어놓은 '반찬통' 같은 것입니다. 어디서든 똑같은 맛(실행 결과)을 낼 수 있게 해주는 마법의 가방입니다."
    },
    {
        "term": "CI/CD",
        "role": "DEVELOPER",
        "translation": "코드 변경 사항을 자동으로 빌드, 테스트하고 배포하는 파이프라인입니다. Jenkins나 GitHub Actions를 통해 지속적 통합과 지속적 배포를 구현하여 배포 주기를 단축합니다."
    }
]

# 개별 예시를 위한 템플릿
example_formatter_template = """
용어: {term}
역할: {role}
번역: {translation}
"""
example_prompt = PromptTemplate(
    input_variables=["term", "role", "translation"],
    template=example_formatter_template,
)

# 전체 Few-shot 프롬프트 템플릿 구성
jargon_few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="""당신은 IT 전문 용어를 다양한 직무의 사람들에게 알맞은 눈높이로 설명해주는 커뮤니케이션 전문가입니다.
사용자가 용어와 대상 직무(Role)를 입력하면, 해당 직무의 지식 수준에 맞춰 친절하고 명확하게 번역해주세요.""",
    suffix="""
용어: {term}
역할: {role}
번역: """,
    input_variables=["term", "role"],
)
