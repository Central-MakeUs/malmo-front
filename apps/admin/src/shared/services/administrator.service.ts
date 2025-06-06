// import {
//   AdministersApi,
//   AdministersApiAdministratorsControllerCreateRequest,
//   AdministersApiAdministratorsControllerUpdateRequest,
//   GetAdministratorResDto,
// } from '@data/admin-api/api'
// import { queryOptions } from '@tanstack/react-query'
// import apiInstance from '../libs/api'

// export const QUERY_KEY = 'administrators'

// export interface Administrator extends GetAdministratorResDto {}

// class AdministratorService extends AdministersApi {
//   constructor() {
//     super(undefined, '', apiInstance)
//   }

//   async create(body: AdministersApiAdministratorsControllerCreateRequest['postAdministratorReqDto']) {
//     const { data } = await this.administratorsControllerCreate({ postAdministratorReqDto: body })
//     return { id: data.id }
//   }

//   async findAll(params: { search?: string; page: number; pageSize: number }) {
//     try {
//       const { page, pageSize, ...rest } = params
//       const { data } = await this.administratorsControllerFindAll({
//         ...rest,
//         start: (params.page - 1) * params.pageSize,
//         perPage: params.pageSize,
//       })
//       return data
//     } catch (e) {
//       return { data: [], total: 0 }
//     }
//   }

//   async findOne(params: { id: number }) {
//     const { data } = await this.administratorsControllerFindOne({ id: params.id })
//     return data
//   }

//   async update(id: number, body: AdministersApiAdministratorsControllerUpdateRequest['patchAdministratorReqDto']) {
//     const { data } = await this.administratorsControllerUpdate({ id, patchAdministratorReqDto: body })
//     return { id: data.id }
//   }

//   findAllQuery(...params: Parameters<typeof this.findAll>) {
//     return queryOptions({
//       queryKey: [QUERY_KEY, params],
//       queryFn: () => this.findAll(...params),
//     })
//   }

//   findOneQuery(params: { id?: number }) {
//     return queryOptions({
//       queryKey: [QUERY_KEY, params],
//       queryFn: () => {
//         if (params.id) {
//           return this.findOne({ id: params.id })
//         }
//         throw new Error('id is required')
//       },
//     })
//   }
// }

// export default new AdministratorService()
