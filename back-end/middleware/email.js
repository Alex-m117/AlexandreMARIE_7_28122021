// Email-Validator pour s'assurer que la saisie utilisateur et bien un email.
const emailValidator = require('email-validator');
const regexEmail = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/

module.exports = (req, res, next) => {
	if (regexEmail.test(req.body.email) && (emailValidator.validate(req.body.email))) {
		next();
	}
	else {
		return res.status(401).json({ message: 'Veuillez saisir une adresse email valide'});
	}
};