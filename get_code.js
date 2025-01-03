const CHAR_MAP = "CM7WD6N4RHF9ZL3XKQGVPBTJY";
const BASE = CHAR_MAP.length;
const EPOCH = new Date("2016-02-01");

function encode(num) {
	let encoded = "";
	while (num >= BASE) {
		encoded = CHAR_MAP[num % BASE] + encoded;
		num = Math.floor(num / BASE);
	}
	return CHAR_MAP[num] + encoded;
}

function decode(encoded) {
	let num = 0;
	for (let i = 0; i < encoded.length; i++) {
		const char = encoded[i];
		const exp = encoded.length - i - 1;
		num += Math.pow(BASE, exp) * CHAR_MAP.indexOf(char);
	}
	return num;
}

function getMinutesSinceEpoch(purchased) {
	const date = new Date(purchased);
	return (date - EPOCH) / 1000 / 60 - date.getTimezoneOffset();
}

function getCheckDigit(code) {
	const chars = code.split("").reverse();
	let checkDigit = 0;
	for (let i = 0; i < chars.length; i++) {
		let value = decode(chars[i]);
		if ((i % 2) === 0) {
			value *= 2;
			const encoded = encode(value);
			if (encoded.length === 2) {
				value = [...encoded].map(decode).reduce((total, num) => total + num, 0);
			}
		}
		checkDigit += value;
	}
	checkDigit %= BASE;

	if (checkDigit > 0) {
		checkDigit = BASE - checkDigit;
	}

	return checkDigit;
}

function generateCode(storeId, orderId, purchased) {
	const encStoreId = encode(storeId).padStart(3, encode(0));
	const encOrderId = encode((orderId % 100) + 125);
	const encMinutes = encode(purchased).padStart(5, encode(0))

	let code = encStoreId + encode(3) + encOrderId + encMinutes;

	code += encode(getCheckDigit(code));

	return code.match(/.{4}/g).join("-");
}

// The date is checked to make sure it's not expired, so here we make sure it's within 2 days of current time
function randomMinutesFromEpoch() {
    const EPOCH = new Date("2016-02-01");
    const now = Date.now();
    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;
    const randomTime = now + (Math.random() * twoDaysInMillis * 2 - twoDaysInMillis);
    const minutesFromEpoch = Math.floor((randomTime - EPOCH.getTime()) / (1000 * 60));
    return minutesFromEpoch;
}
const r = (min, max) => Math.floor(Math.random() * (max - min) + min); 

const genRan = () => generateCode(r(1, 1000), r(10, 150), randomMinutesFromEpoch())
console.log(genRan());
