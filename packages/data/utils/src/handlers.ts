import { http, HttpResponse } from 'msw';

export const systemHandlers = [
  http.get('/api/system/health', () => {
    return HttpResponse.json({ status: 'OK' });
  })
];

export const dataHandlers = [
  http.get('/api/data', () => {
    return HttpResponse.json([{ id: 1, name: 'Sample' }]);
  })
];
