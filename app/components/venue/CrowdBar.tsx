import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CrowdBarProps {
  malePercentage: number;
  femalePercentage: number;
  totalPeople: number;
}

export function CrowdBar({ malePercentage, femalePercentage, totalPeople }: CrowdBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Gender Ratio</Text>
        <Text style={styles.ratioText}>
          {malePercentage}% M • {femalePercentage}% F
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.bar, 
            { 
              width: `${malePercentage}%`,
              backgroundColor: '#7C4DFF', // Purple color for male
            }
          ]} 
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{totalPeople} people checked in</Text>
        <Text style={styles.footerText}>Updated now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF', // gray-400
  },
  ratioText: {
    fontSize: 12,
    color: '#9CA3AF', // gray-400
  },
  barContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#374151', // gray-700
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF', // gray-400
  },
});
