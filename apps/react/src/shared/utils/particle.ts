// 단어의 마지막 글자에 따라 적절한 조사('과' 또는 '와')를 반환하는 함수
export function getParticle(word: string): '과' | '와' {
  if (!word || word.length === 0) {
    return '와'
  }

  const lastChar = word[word.length - 1]
  if (!lastChar) {
    return '와'
  }

  const lastCharCode = lastChar.charCodeAt(0)

  // 한글인지 확인
  if (lastCharCode >= 0xac00 && lastCharCode <= 0xd7a3) {
    // 받침이 있는지 확인
    const hasConsonant = (lastCharCode - 0xac00) % 28 !== 0
    return hasConsonant ? '과' : '와'
  }

  // 숫자 처리
  if (/\d$/.test(lastChar)) {
    const digit = parseInt(lastChar, 10)
    // 0,1,3,6,7,8은 받침이 있음 (영, 일, 삼, 육, 칠, 팔)
    // 2,4,5,9는 받침이 없음 (이, 사, 오, 구)
    const hasConsonant = [0, 1, 3, 6, 7, 8].includes(digit)
    return hasConsonant ? '과' : '와'
  }

  // 영어 처리 (받침이 있을 확률이 높은 알파벳)
  if (/[a-zA-Z]$/.test(lastChar)) {
    const consonantLikeLetters = ['b', 'c', 'g', 'k', 'l', 'm', 'n', 'p', 'r', 't', 'x', 'z']
    const hasConsonantLike = consonantLikeLetters.includes(lastChar.toLowerCase())
    return hasConsonantLike ? '과' : '와'
  }

  // 기타 문자는 기본적으로 '와' 사용
  return '와'
}

// 단어에 조사를 붙여서 반환하는 함수
export function withParticle(word: string): string {
  return `${word}${getParticle(word)}`
}
