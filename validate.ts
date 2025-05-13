import {BPInfoSchema, handleZodError, ZodError} from '.';

fetch('https://eosrio.io/bp.json').then(res => res.json()).then(json => {
    try {
        const producerInfo = BPInfoSchema.parse(json);
        console.log(producerInfo.producer_account_name);
        console.log(producerInfo.org);
        console.log(producerInfo.nodes);
    } catch (e) {
        if (e instanceof ZodError) {
            handleZodError(e, {logToConsole: true, originalObject: json});
        }
    }
})
