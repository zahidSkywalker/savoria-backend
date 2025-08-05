// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data stores (replace with DB in production)
let menuItems = [
  {
    id: 1,
    name: "Crispy Calamari",
    description: "Tender calamari rings, lightly battered and fried to perfection. Served with tangy marinara sauce.",
    price: 12.99,
    image: "https://placehold.co/300x200?text=Crispy+Calamari+Bangladesh+Style",
    category: "starters",
    rating: 4.7
  },
  {
    id: 2,
    name: "Caprese Salad",
    description: "Fresh mozzarella, ripe tomatoes, and basil leaves drizzled with balsamic glaze.",
    price: 10.99,
    image: "https://placehold.co/300x200?text=Caprese+Salad+Fresh+Ingredients",
    category: "starters",
    rating: 4.5
  },
  {
    id: 3,
    name: "Grilled Salmon",
    description: "Atlantic salmon fillet grilled to perfection, served with seasonal vegetables and lemon butter sauce.",
    price: 24.99,
    image: "https://placehold.co/300x200?text=Grilled+Salmon+with+Lemon+Butter",
    category: "mains",
    rating: 4.8
  },
  {
    id: 4,
    name: "Beef Tenderloin",
    description: "8oz prime beef tenderloin cooked to your preference, accompanied by truffle mashed potatoes and asparagus.",
    price: 29.99,
    image: "https://placehold.co/300x200?text=Beef+Tenderloin+with+Truffle+Mashed+Potatoes",
    category: "mains",
    rating: 4.9
  },
  {
    id: 5,
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
    price: 8.99,
    image: "https://placehold.co/300x200?text=Tiramisu+Classic+Italian+Dessert",
    category: "desserts",
    rating: 4.6
  },
  {
    id: 6,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
    price: 9.99,
    image: "https://placehold.co/300x200?text=Chocolate+Lava+Cake+with+Vanilla+Ice+Cream",
    category: "desserts",
    rating: 4.8
  },
  {
    id: 7,
    name: "Signature Cocktail",
    description: "Our house special blend of premium spirits with fresh fruit juices and herbs.",
    price: 13.99,
    image: "https://placehold.co/300x200?text=Signature+Cocktail+Fresh+Fruits",
    category: "drinks",
    rating: 4.7
  },
  {
    id: 8,
    name: "Craft Beer Selection",
    description: "Rotating selection of local craft beers. Ask your server for today's options.",
    price: 7.99,
    image: "https://placehold.co/300x200?text=Craft+Beer+Selection+Bangladesh",
    category: "drinks",
    rating: 4.5
  }
];

let galleryItems = [
  {
    id: 1,
    image: "https://placehold.co/600x400?text=Signature+Pasta+Bangladesh+Style",
    title: "Signature Pasta",
    category: "dishes"
  },
  {
    id: 2,
    image: "https://placehold.co/600x400?text=Grilled+Seafood+Platter+Fresh+Catch",
    title: "Grilled Seafood Platter",
    category: "dishes"
  },
  {
    id: 3,
    image: "https://placehold.co/600x400?text=Main+Dining+Area+Dhaka+Restaurant",
    title: "Main Dining Area",
    category: "ambience"
  },
  {
    id: 4,
    image: "https://placehold.co/600x400?text=Private+Dining+Room+Cozy+Ambience",
    title: "Private Dining Room",
    category: "ambience"
  },
  {
    id: 5,
    image: "https://placehold.co/600x400?text=Wine+Tasting+Event+Dhaka",
    title: "Wine Tasting Event",
    category: "events"
  },
  {
    id: 6,
    image: "https://placehold.co/600x400?text=Chef's+Special+Night+Event",
    title: "Chef's Special Night",
    category: "events"
  }
];

let reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "2023-08-15",
    comment: "The food was absolutely amazing! I tried the beef tenderloin and it was cooked to perfection. The service was also outstanding. Will definitely be back!",
    avatar: "https://placehold.co/100x100?text=SJ"
  },
  {
    id: 2,
    name: "Michael Brown",
    rating: 4,
    date: "2023-08-10",
    comment: "Great atmosphere and delicious food. The calamari appetizer was especially good. Only giving 4 stars because the wait time was a bit long, but it was a Saturday night.",
    avatar: "https://placehold.co/100x100?text=MB"
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 5,
    date: "2023-07-28",
    comment: "We celebrated our anniversary here and it was perfect. The staff made us feel special and the chocolate lava cake was to die for!",
    avatar: "https://placehold.co/100x100?text=ED"
  }
];

let reservations = [];
let newsletterSubscribers = [];
let orders = [];

// Routes

// Get menu items (optionally filter by category)
app.get('/api/menu', (req, res) => {
  const category = req.query.category;
  if (category && category !== 'all') {
    const filtered = menuItems.filter(item => item.category === category);
    res.json(filtered);
  } else {
    res.json(menuItems);
  }
});

// Get gallery items (optionally filter by category)
app.get('/api/gallery', (req, res) => {
  const category = req.query.category;
  if (category && category !== 'all') {
    const filtered = galleryItems.filter(item => item.category === category);
    res.json(filtered);
  } else {
    res.json(galleryItems);
  }
});

// Get reviews
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

// Post a new review
app.post('/api/reviews', (req, res) => {
  const { name, email, rating, comment } = req.body;

  if (!name || !email || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newReview = {
    id: reviews.length + 1,
    name,
    rating: Number(rating),
    date: new Date().toISOString().split('T')[0],
    comment,
    avatar: `https://placehold.co/100x100?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Post a new reservation
app.post('/api/reservations', (req, res) => {
  const { name, email, phone, guests, date, time, notes } = req.body;

  if (!name || !email || !phone || !guests || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simple availability check (in real app, check DB for conflicts)
  const reservationDateTime = new Date(`${date}T${time}:00`);
  const overlapping = reservations.filter(r => {
    const rDateTime = new Date(`${r.date}T${r.time}:00`);
    return rDateTime.getTime() === reservationDateTime.getTime();
  });

  if (overlapping.length >= 10) { // Assume max 10 tables per slot
    return res.status(409).json({ error: 'No tables available at this time' });
  }

  const newReservation = {
    id: uuidv4(),
    name,
    email,
    phone,
    guests,
    date,
    time,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  reservations.push(newReservation);
  res.status(201).json({ message: 'Reservation confirmed', reservation: newReservation });
});

// Post newsletter subscription
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const exists = newsletterSubscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Email already subscribed' });
  }

  newsletterSubscribers.push({ id: uuidv4(), email, subscribedAt: new Date().toISOString() });
  res.status(201).json({ message: 'Subscribed successfully' });
});

// Post a new order
app.post('/api/orders', (req, res) => {
  const { items, customer } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  if (!customer || !customer.name || !customer.email || !customer.phone) {
    return res.status(400).json({ error: 'Customer information is required' });
  }

  // Calculate total
  let total = 0;
  const orderItems = [];

  for (const orderItem of items) {
    const menuItem = menuItems.find(m => m.id === orderItem.id);
    if (!menuItem) {
      return res.status(400).json({ error: `Menu item with id ${orderItem.id} not found` });
    }
    const quantity = orderItem.quantity && orderItem.quantity > 0 ? orderItem.quantity : 1;
    total += menuItem.price * quantity;
    orderItems.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity
    });
  }

  const newOrder = {
    id: uuidv4(),
    items: orderItems,
    customer,
    total: Number(total.toFixed(2)),
    status: 'Order Confirmed',
    createdAt: new Date().toISOString(),
    estimatedArrival: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes from now
  };

  orders.push(newOrder);

  res.status(201).json({ message: 'Order placed successfully', order: newOrder });
});

// Get order status by order ID
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Simulate status progression based on time elapsed
  const created = new Date(order.createdAt);
  const now = new Date();
  const diffMinutes = Math.floor((now - created) / 60000);

  let status = 'Order Confirmed';
  if (diffMinutes >= 5 && diffMinutes < 15) status = 'Preparing';
  else if (diffMinutes >= 15 && diffMinutes < 25) status = 'On the Way';
  else if (diffMinutes >= 25) status = 'Delivered';

  order.status = status;

  res.json({
    id: order.id,
    status: order.status,
    estimatedArrival: order.estimatedArrival,
    customer: order.customer,
    items: order.items,
    total: order.total
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Savoria Restaurant backend running on port ${PORT}`);
});
