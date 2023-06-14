import { CustomError, HTTPError } from './error';

describe('Given', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(418, 'Test error', 'new error in test');
    });
    test('should first', () => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toHaveProperty('statusCode', 418);
        expect(error).toHaveProperty('statusMessage', 'Test error');
        expect(error).toHaveProperty('message', 'new error in test');
        expect(error).toHaveProperty('name', 'HTTPError');
    });
});
