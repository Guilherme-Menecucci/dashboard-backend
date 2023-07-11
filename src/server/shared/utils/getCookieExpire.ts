export default function getCookieExpire() {
  return Number.parseInt(process.env.COOKIE_DAYS_EXPIRE) * 24 * 60 * 60 * 1000;
}
