export function RPCReflect() {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        console.log(`RPCReflect decorator applied to parameter ${parameterIndex} of ${String(propertyKey)}`);
    };
}