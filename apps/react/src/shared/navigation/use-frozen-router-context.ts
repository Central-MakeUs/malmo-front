import cloneDeep from 'lodash-es/cloneDeep'

// 라우터에서 실제로 사용하는 필드 좁힌 타입
type RouterOptionsLike = { context?: unknown; routesById?: unknown }
type RouterLike = {
  options?: RouterOptionsLike
  routesById?: unknown
  routeTree?: unknown
}

/**
 * options.context 값을 스냅샷에도 보존해 훅/컨텍스트 유지
 */
const preserveOptionsContext = (snapshot: RouterLike, original: RouterLike) => {
  if (snapshot?.options && original?.options) {
    snapshot.options = {
      ...snapshot.options,
      context: original.options.context,
    }
  }
}

/**
 *  효과 실행 시점에 고정된 라우터 컨텍스트를 캡처하여 전환 애니메이션 동안 동일한 라우트 트리/레지스트리를 참조
 */
export function snapshotRouterContext<T extends RouterLike>(liveRouter: T): T {
  const snapshot = cloneDeep(liveRouter) as T
  preserveOptionsContext(snapshot, liveRouter)

  // routesById/routeTree 참조 보존
  if (liveRouter?.routesById) {
    ;(snapshot as RouterLike).routesById = liveRouter.routesById
  }
  if (liveRouter?.options?.routesById) {
    ;(snapshot as RouterLike).options = {
      ...((snapshot as RouterLike).options || {}),
      routesById: liveRouter.options?.routesById,
    }
  }
  if (liveRouter?.routeTree) {
    ;(snapshot as RouterLike).routeTree = liveRouter.routeTree
  }

  return snapshot
}
