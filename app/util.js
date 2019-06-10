const regexPass = /^([a-z0-9]){8,}$/i;
const regexMail = /^[a-z0-9._-]+@wolox.(co|cl|com|com.ar)+$/i;
exports.paramsValidation = (pass, email) => {
  if (!regexPass.test(pass) || !regexMail.test(email)) {
    return false;
  }
  return true;
};
