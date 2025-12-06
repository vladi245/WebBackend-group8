export async function mockFunction(modulePath, fnName, returnValue) {
  await jest.unstable_mockModule(modulePath, () => ({
    [fnName]: jest.fn().mockResolvedValue(returnValue)
  }));
}
