const { Router } = require('express');
const router = Router();


const {isAuthenticatedJSON, validCancel} =  require('../helpers/auth');
const { renderCancelar,addSolid,cancelarSolicitud }    = require('../controllers/solicitud.controller');


router.get('/solid/:solid/:num/:user',validCancel,renderCancelar);
router.delete('/solid/:solid/:num/:user',validCancel,cancelarSolicitud);

router.post('/solid/new',isAuthenticatedJSON,addSolid);


module.exports = router;