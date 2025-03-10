import React from "react";
import { View, Text, Image, ScrollView, Switch, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";

const ProfileScreen = () => {
  const [isNotificationEnabled, setNotificationEnabled] = React.useState(true);

  // Sample User Data (Replace with API Data)
  const user = {
    name: "Masi Ramezanzade",
    program: "Lose a Fat Program",
    avatar: "https://via.placeholder.com/150", // Replace with actual image URL
    details: [
      { label: "Height", value: "180cm" },
      { label: "Weight", value: "65kg" },
      { label: "Age", value: "22yo" },
    ],
    accountOptions: [
      { title: "Personal Data", icon: "user" },
      { title: "Achievement", icon: "award" },
      { title: "Activity History", icon: "clock" },
      { title: "Workout Progress", icon: "bar-chart-2" },
    ],
    otherOptions: [
      { title: "Contact Us", icon: "mail" },
      { title: "Privacy Policy", icon: "shield" },
      { title: "Settings", icon: "settings" },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
      <Image source={require("../../assets/o2.png")} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.program}>{user.program}</Text>
        </View>
        <Button mode="contained" style={styles.editButton}>
          Edit
        </Button>
      </View>

      {/* User Details */}
      <View style={styles.detailsContainer}>
        {user.details.map((item, index) => (
          <View key={index} style={styles.detailBox}>
            <Text style={styles.detailValue}>{item.value}</Text>
            <Text style={styles.detailLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Account Section */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        {user.accountOptions.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <Icon name={option.icon} size={20} color="#0f0" />
            <Text style={styles.optionText}>{option.title}</Text>
          </View>
        ))}
      </Card>

      {/* Notification Section */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Notification</Text>
        <View style={styles.optionRow}>
          <Icon name="bell" size={20} color="#0f0" />
          <Text style={styles.optionText}>Pop-up Notification</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={() => setNotificationEnabled(!isNotificationEnabled)}
          />
        </View>
      </Card>

      {/* Other Options */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Other</Text>
        {user.otherOptions.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <Icon name={option.icon} size={20} color="#0f0" />
            <Text style={styles.optionText}>{option.title}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  program: {
    color: "gray",
  },
  editButton: {
    marginLeft: "auto",
    backgroundColor: "#a05af0",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  detailBox: {
    alignItems: "center",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#a05af0",
  },
  detailLabel: {
    fontSize: 12,
    color: "gray",
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
});

export default ProfileScreen;
