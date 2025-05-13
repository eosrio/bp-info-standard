import {BPInfoSchema} from "./schema";
import * as z from 'zod';

const jsonSchema = z.toJSONSchema(BPInfoSchema);
console.log(JSON.stringify(jsonSchema, null, 2));