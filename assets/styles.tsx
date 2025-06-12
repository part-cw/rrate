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
    margin: 20,
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
    marginVertical: 10,
  }, screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },

  // Dropdown List
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownList: {
    marginTop: 2,
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    maxHeight: 250,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Respiratory Rate Display
  leftColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 25,
  },
  rateValue: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc'
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  labelMain: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelSub: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageLabel: {
    marginRight: 8,
    fontSize: 16,
  },

  // Slider
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderLine: {
    height: 2,
    backgroundColor: 'black',
    width: 270,
    position: 'absolute',
    top: 10,
  },
  triangle: {
    position: 'absolute',
    top: 7,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
  },
  numberRow: {
    flexDirection: 'row',
    marginTop: 20
  },
  step: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16
  },

  // Consistency Chart
  outsideThreshold: {
    backgroundColor: '#ffffff',
    borderRadius: 5
  },
  insideThreshold: {
    backgroundColor: '#E8E8E8',
    borderRadius: 5
  },
  consistentTap: {
    width: 10,
    height: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#000000',
  },
  inconsistentTap: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: '#DC3220',
    borderWidth: 1,
    borderColor: '#000000',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginVertical: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    justifyContent: 'space-between',
  },

});
