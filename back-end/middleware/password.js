// Password-Validator pour contrôle de la force du mot de passe saisie par l'utilisateur.
const passwordValidator = require('password-validator')

const passwordSchema = new passwordValidator();

// le schéma que doit respecter le mot de passe pour validation.
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 30
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res,next) => {
	if(passwordSchema.validate(req.body.password)){
		next();
	}
	else{
		return res.status(400).json({ message : "Le mot de passe n'est pas assez fort: "+ passwordSchema.validate('req.body.password', {list: true})});
	}
};