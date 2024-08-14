export class OutputServerEventStream {
    write(data: any) {
        console.log('OutputServerEventStream write:', data);
    }

    end() {
        console.log('OutputServerEventStream ended');
    }
}