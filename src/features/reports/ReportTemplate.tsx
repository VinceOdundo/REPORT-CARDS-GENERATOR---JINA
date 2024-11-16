import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { Student, SchoolInfo } from "../../types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1pt solid #000000",
  },
  schoolName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  // Add more styles...
});

export const ReportTemplate: React.FC<{
  student: Student;
  school: SchoolInfo;
}> = ({ student, school }) => {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>{school.name}</Text>
        {/* Add more report card content */}
      </View>
    </View>
  );
};
