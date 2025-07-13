import momoChat from '@/assets/images/momo-chat.png'

export function AiChatBubble() {
  return (
    <div className="flex w-full items-start gap-3">
      <img src={momoChat} alt="모모 캐릭터 이미지" className="h-auto w-[50px]" />
      <div className="flex w-full items-end gap-2">
        <div>
          <p className="mb-[6px] text-body-3 font-semibold text-malmo-rasberry-500">모모</p>
          <div className="mb-2 w-fit rounded-[10px] rounded-tl-none bg-gray-100 px-[10px] py-[14px]">
            <p>{'OO아 안녕! 나는 연애 갈등 상담사 모모야. 나와의 대화를 마무리하고 싶다면 종료하기 버튼을 눌러줘!'}</p>
          </div>

          <div className="w-fit rounded-[10px] rounded-tl-none bg-gray-100 px-[10px] py-[14px]">
            <p>
              {
                '오늘은 어떤 고민 때문에 나를 찾아왔어? 먼저 연인과 있었던 갈등 상황을 이야기해 주면 내가 같이 고민해볼게!'
              }
            </p>
          </div>
        </div>
        <p className="text-[11px] leading-[20px] text-gray-600">21:56</p>
      </div>
    </div>
  )
}

export function MyChatBubble() {
  return (
    <div className="flex w-full items-end gap-2">
      <p className="text-[11px] leading-[20px] text-gray-600">21:56</p>
      <div className="w-fit rounded-[10px] rounded-br-none bg-[#FFF2F4] px-[10px] py-[14px]">
        <p>
          {'같이 있으면 좋은데, 마음을 표현하는 방식이 너무 달라.. 나만 노력하고 있는 느낌이 들 때가 있어서 속상해'}
        </p>
      </div>
    </div>
  )
}
