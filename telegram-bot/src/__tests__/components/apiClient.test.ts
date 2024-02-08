import { describe, it, expect, afterEach, beforeAll, spyOn } from 'bun:test';
import MockAdapter from 'axios-mock-adapter';
import { ApiClient } from 'components/apiClient';

describe('ApiClient', () => {
    let apiClient: ApiClient;
    let mock: MockAdapter;

    beforeAll(() => {
        apiClient = ApiClient.getInstance();
        // @ts-ignore
        mock = new MockAdapter(apiClient.client);
    });

    afterEach(() => {
        mock.reset();
    });

    it('should make a GET request', async () => {
        const responseData = { foo: 'bar' };
        mock.onGet('/test').reply(200, responseData);

        const data = await apiClient.get('/test');
        expect(data).toEqual(responseData);
    });

    it('should make a POST request', async () => {
        const responseData = { foo: 'bar' };
        mock.onPost('/test').reply(200, responseData);

        const data = await apiClient.post('/test', { baz: 'qux' });
        expect(data).toEqual(responseData);
    });

    it('should make a PUT request', async () => {
        const responseData = { foo: 'bar' };
        mock.onPut('/test').reply(200, responseData);

        const data = await apiClient.put('/test', { baz: 'qux' });
        expect(data).toEqual(responseData);
    });

    it('should make a DELETE request', async () => {
        const responseData = { foo: 'bar' };
        mock.onDelete('/test').reply(200, responseData);

        const data = await apiClient.delete('/test');
        expect(data).toEqual(responseData);
    });
});
