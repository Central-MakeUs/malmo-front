import { createFileRoute } from '@tanstack/react-router'
import logo from '/images/logo.png'

export const Route = createFileRoute('/(auth)/register/')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <section className="max my-auto w-full max-w-[536px] space-y-12 px-6 py-8">
      {/* 로고와 문구 */}
      <div className="space-y-9">
        <img src={logo} alt="logo" className="h-[42px] w-[192px]" />
        <div className="flex flex-col space-y-0.5">
          <span className="text-display-02 font-extrabold text-key">환영합니다!</span>
          <span className="text-title-01 font-semibold">회원가입 유형을 선택해주세요.</span>
        </div>
      </div>
    </section>
  )
}
