const { new: _new, index, show, create, edit, update, delete: _delete } = require('../controllers/ResourceController');

function auth (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('danger', 'You need to login first.');
    return res.redirect('/login');
  }
  next();
}

module.exports = router => {
  router.get('/resources', index);
  router.get('/resources/new', auth, _new); 
  router.post('/resources', auth, create);
  router.post('/resources/update', auth, update); 
  router.post('/resources/delete', auth, _delete); 
  router.get('/resources/:id/edit', auth, edit); 
  router.get('/resources/:id', show);

};