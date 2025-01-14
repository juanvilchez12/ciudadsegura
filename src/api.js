import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { fetchButtonClickStatsByDate } from './api'; // Asegúrate de que esta función esté bien configurada

const App = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [buttonStats, setButtonStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchStats = async () => {
    setLoading(true);
    try {
      console.log(`Fetching stats for ${year}-${month}-${day}`);
      const data = await fetchButtonClickStatsByDate(year, month, day);
      console.log('Fetched stats:', data);  // Verifica lo que obtienes de la API
      setButtonStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas de clics en botones.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Estadísticas de Clics de Botones por Fecha</Text>

      {/* Año */}
      <Text style={styles.label}>Año:</Text>
      <Picker selectedValue={year} style={styles.picker} onValueChange={setYear}>
        {[2022, 2023, 2024, 2025].map((yearOption) => (
          <Picker.Item key={yearOption} label={String(yearOption)} value={yearOption} />
        ))}
      </Picker>

      {/* Mes */}
      <Text style={styles.label}>Mes:</Text>
      <Picker selectedValue={month} style={styles.picker} onValueChange={setMonth}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((monthOption) => (
          <Picker.Item key={monthOption} label={String(monthOption)} value={monthOption} />
        ))}
      </Picker>

      {/* Día */}
      <Text style={styles.label}>Día:</Text>
      <Picker selectedValue={day} style={styles.picker} onValueChange={setDay}>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((dayOption) => (
          <Picker.Item key={dayOption} label={String(dayOption)} value={dayOption} />
        ))}
      </Picker>

      {/* Botón para obtener estadísticas */}
      <TouchableOpacity style={styles.button} onPress={handleFetchStats} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Obtener Estadísticas'}</Text>
      </TouchableOpacity>

      {/* Mostrar las estadísticas */}
      {buttonStats.length > 0 && !loading ? (
        <View style={styles.statsContainer}>
          <Text style={styles.statsHeader}>Estadísticas de Botones:</Text>
          {buttonStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statText}>
                {stat._id}: {stat.count} uso{stat.count > 1 ? 's' : ''}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {loading && <Text style={styles.loadingText}>Cargando...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  statsContainer: {
    marginTop: 20,
  },
  statsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statText: {
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default App;
