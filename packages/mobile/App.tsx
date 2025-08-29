
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Screen
function HomeScreen({ navigation }) {
  const services = [
    { 
      id: '1', 
      title: 'Order Fuel', 
      icon: 'local-gas-station', 
      color: '#F05454',
      screen: 'FuelOrder'
    },
    { 
      id: '2', 
      title: 'Marketplace', 
      icon: 'shopping-cart', 
      color: '#30475E',
      screen: 'Marketplace'
    },
    { 
      id: '3', 
      title: 'Toll Payment', 
      icon: 'qr-code-scanner', 
      color: '#F05454',
      screen: 'TollPayment'
    },
    { 
      id: '4', 
      title: 'Track Orders', 
      icon: 'local-shipping', 
      color: '#30475E',
      screen: 'OrderTracking'
    },
  ];

  const renderService = ({ item }) => (
    <TouchableOpacity 
      style={[styles.serviceCard, { borderLeftColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Icon name={item.icon} size={32} color={item.color} />
      <Text style={styles.serviceTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BrillPrime</Text>
        <Text style={styles.headerSubtitle}>Your all-in-one urban mobility solution</Text>
      </View>
      
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.servicesGrid}
      />
    </View>
  );
}

// Fuel Order Screen
function FuelOrderScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Order Fuel</Text>
      <Text style={styles.screenSubtitle}>Get fuel delivered to your location</Text>
      
      <View style={styles.fuelCard}>
        <Text style={styles.cardTitle}>Select Fuel Type</Text>
        <TouchableOpacity style={styles.fuelOption}>
          <Icon name="local-gas-station" size={24} color="#F05454" />
          <Text style={styles.fuelText}>Gasoline - ₦200/L</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fuelOption}>
          <Icon name="local-gas-station" size={24} color="#F05454" />
          <Text style={styles.fuelText}>Diesel - ₦180/L</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Marketplace Screen
function MarketplaceScreen() {
  const products = [
    { id: '1', name: 'Fresh Groceries', price: '₦2,500', image: 'store' },
    { id: '2', name: 'Electronics', price: '₦15,000', image: 'devices' },
    { id: '3', name: 'Home Essentials', price: '₦5,000', image: 'home' },
  ];

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Marketplace</Text>
      <Text style={styles.screenSubtitle}>Shop from local merchants</Text>
      
      {products.map((product) => (
        <TouchableOpacity key={product.id} style={styles.productCard}>
          <Icon name={product.image} size={40} color="#30475E" />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
          </View>
          <Icon name="arrow-forward" size={24} color="#F05454" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Toll Payment Screen
function TollPaymentScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Toll Payment</Text>
      <Text style={styles.screenSubtitle}>Scan QR code at toll gate</Text>
      
      <View style={styles.qrSection}>
        <Icon name="qr-code-scanner" size={80} color="#30475E" />
        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
        <Text style={styles.qrInfo}>
          Point your camera at the toll gate QR code to pay instantly
        </Text>
      </View>
    </View>
  );
}

// Order Tracking Screen
function OrderTrackingScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Track Orders</Text>
      <Text style={styles.screenSubtitle}>Monitor your deliveries</Text>
      
      <View style={styles.trackingCard}>
        <Text style={styles.orderNumber}>Order #FD001</Text>
        <Text style={styles.orderStatus}>In Transit</Text>
        <View style={styles.trackingInfo}>
          <Icon name="local-shipping" size={24} color="#F05454" />
          <Text style={styles.trackingText}>Your fuel delivery is on the way</Text>
        </View>
      </View>
    </View>
  );
}

// Profile Screen
function ProfileScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Profile</Text>
      <View style={styles.profileSection}>
        <Icon name="account-circle" size={80} color="#30475E" />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
        
        <TouchableOpacity style={styles.profileOption}>
          <Icon name="payment" size={24} color="#30475E" />
          <Text style={styles.profileOptionText}>Payment Methods</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileOption}>
          <Icon name="history" size={24} color="#30475E" />
          <Text style={styles.profileOptionText}>Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileOption}>
          <Icon name="settings" size={24} color="#30475E" />
          <Text style={styles.profileOptionText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Orders') {
            iconName = 'receipt';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F05454',
        tabBarInactiveTintColor: '#gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Orders" component={OrderTrackingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Home Stack Navigator
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="FuelOrder" component={FuelOrderScreen} />
      <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
      <Stack.Screen name="TollPayment" component={TollPaymentScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  header: {
    backgroundColor: '#30475E',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#F2F4F7',
    marginTop: 5,
  },
  servicesGrid: {
    padding: 20,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    color: '#30475E',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F2F4F7',
    padding: 20,
    paddingTop: 60,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#30475E',
    marginBottom: 5,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  fuelCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#30475E',
    marginBottom: 15,
  },
  fuelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  fuelText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#30475E',
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30475E',
  },
  productPrice: {
    fontSize: 14,
    color: '#F05454',
    fontWeight: 'bold',
  },
  qrSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButton: {
    backgroundColor: '#F05454',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 15,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  qrInfo: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  trackingCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30475E',
  },
  orderStatus: {
    fontSize: 16,
    color: '#F05454',
    fontWeight: '600',
    marginVertical: 10,
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#30475E',
    marginTop: 15,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#30475E',
  },
});
