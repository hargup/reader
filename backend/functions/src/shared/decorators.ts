export function CloudHTTPv2(config: any): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        // Simplified implementation
        console.log(`CloudHTTPv2 decorator applied to ${String(propertyKey)}`);
        return descriptor;
    };
}