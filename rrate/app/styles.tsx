import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  tapCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#4267BC',
    borderWidth: 1,
    borderColor: '#000000',
  },
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  floatingContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: 350,

    // iOS 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android 
    elevation: 5,
  },
  componentContainer: {
    margin: 10,
  }, screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%'
  }
});
