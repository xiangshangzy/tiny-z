import { json} from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json({version:0.1,msg:'hello,world'})
};
