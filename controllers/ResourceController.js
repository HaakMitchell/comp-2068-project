// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/

const viewPath = 'resources';
const Resource = require('../models/resource');
const User = require('../models/user');

exports.index = async (req, res) => {
  try {
    const resources = await Resource
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Books',
      resources: resources
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the archive: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Resource'
  });
};

exports.create = async (req, res) => {
  try {
   
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('User', user);
    const resource = await Resource.create({user: user._id, ...req.body});

    req.flash('success', ' Your Book has created successfully');
    res.redirect(`/resources/${resource.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this book: ${error}`);
    req.session.formData = req.body;
    res.redirect('/resources/new');
  }
};

exports.show = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('user');
    console.log(resource);
    res.render(`${viewPath}/show`, {
      pageTitle: resource.title,
      resource: resource
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this book: ${error}`);
    res.redirect('/');
  }
};

exports.edit = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: resource.title,
      formData: resource
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this book: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let resource = await Resource.findById(req.body.id);
    if (!resource) throw new Error('Book could not be found');

    const attributes = {user: user._id, ...req.body};
    await Resource.validate(attributes);
    await Resource.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'your book was updated successfully');
    res.redirect(`/resources/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this book: ${error}`);
    res.redirect(`/resources/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    
    await Resource.deleteOne({_id: req.body.id});
    req.flash('success', 'The book was deleted successfully');
    res.redirect(`/resources`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this book: ${error}`);
    res.redirect(`/resources`);
  }
};