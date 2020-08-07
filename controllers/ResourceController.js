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
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const resources = await Resource
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

      res.status(200).json(resources);
    } catch (error) {
      res.status(400).json({message: 'There was an error fetching the books', error});
    }
  };

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Book'
  });
};

exports.create = async (req, res) => {
  try {
   
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    
    const resource = await Resource.create({user: user._id, ...req.body});

    res.status(200).json(resource);
  } catch (error) {
    res.status(400).json({message: "There was an error creating the book", error});
  }
};

exports.show = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('user');

      res.status(200).json(resource);
    } catch (error) {
      res.status(400).json({message: "There was an error fetching the blog"});
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

    let resource = await Resource.findById(req.body._id);
    if (!resource) throw new Error('Book could not be found');
   
    const attributes = {user: user._id, ...req.body};
    await Resource.validate(attributes);
    await Resource.findByIdAndUpdate(attributes._id, attributes);

    res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    res.status(400).json({status: 'failed', message: `There was an error in updating the book.`, error});
  }
};

exports.delete = async (req, res) => {
  try {
    
    await Resource.deleteOne({_id: req.body.id});
    res.status(200).json({message: "Yay."});
  } catch (error) {
    res.status(400).json({message: "There was an error deleting the book"});
  }
};
