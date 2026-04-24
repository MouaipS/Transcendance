import { readFileSync } from "node:fs";

const VAULT_ADDR = process.env.VAULT_ADDR
if (!VAULT_ADDR)
	throw new Error("Vault addr env variable undefined");

const INIT_FILE = "/vault/init/keys.json";
let VAULT_TOKEN: string;
try {
    const raw = readFileSync(INIT_FILE, "utf-8");
    VAULT_TOKEN = JSON.parse(raw).root_token;
    if (!VAULT_TOKEN) throw new Error("root_token absent du fichier d'init");
} catch (e) {
    throw new Error(`Lecture du token vault impossible : ${(e as Error).message}`);
}
interface KvResponse<T> { data: { data: T } }

async function readVault<T>(path: string): Promise<T> {
	const res = await fetch(`${VAULT_ADDR}/v1/secret/data/${path}`, {
		headers :{"X-Vault-Token": VAULT_TOKEN! },
	});
	if (!res.ok)
		throw new Error(`Error readVault, code : ${res.status} raison : ${res.statusText}`);
	const json = (await res.json()) as KvResponse<T>;
	return json.data.data;
}

const cache = new Map<string, unknown>();

async function cached<T>(path: string): Promise<T> {
	if(!cache.has(path))
		cache.set(path, await readVault<T>(path));
	return cache.get(path) as T
}

export interface DatabaseSecrets {
	db_user: string;
	db_password: string;
	db_name: string;
}

export interface AuthSecrets {
	pepper: string;
	jwt:	string;
	cookie:	string;
}

export const getAuthSecrets		= () => cached<AuthSecrets>("auth");
export const getDatabaseSecrets = () => cached<DatabaseSecrets>("database");

export async function getDatabaseUrl() {
	const db_user = (await getDatabaseSecrets()).db_user;
	const db_pass = (await getDatabaseSecrets()).db_password;
	const db_name = (await getDatabaseSecrets()).db_name;
	return (`postgresql://${db_user}:${db_pass}@db:5432/${db_name}?schema=public`)
}

export async function getPepper(){
	return (await getAuthSecrets()).pepper;
}

export async function getJwt(){
	return (await getAuthSecrets()).jwt;
}

export async function getCookie(){
	return (await getAuthSecrets()).cookie;
}