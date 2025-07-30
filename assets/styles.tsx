import { StyleSheet, Platform } from 'react-native';
import { Theme } from './theme';

export const GlobalStyles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'web' ? 20 : 0,
  },
  innerContainer: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 500 : 700,
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100%',
  },
  componentContainer: {
    marginVertical: 10,
  },
  floatingContainer: {
    padding: 30,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: "#f5f6f7",
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 500 : 700,
    // Web 
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
    // iOS 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android 
    elevation: 5,
  },
  redirectScreenContainer: {
    margin: 30,
    paddingTop: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
  },
  text: {
    fontSize: 16,
  },
  darkButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#3F3D3D",
    justifyContent: 'center',
    alignItems: 'center'
  },
  lightButtonContainer: {
    paddingVertical: 20,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  // Tap Count
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

  // Dropdown List
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    // Web 
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
    // iOS 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Android 
    elevation: 3,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 20,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  // Respiratory Rate Display
  rrateContainer: {
    flexDirection: 'row',
    zIndex: 10,
    marginVertical: 0,
  },
  leftColumn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateValue: {
    fontSize: 60,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#ccc',
    margin: 5
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
    textAlign: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Slider
  marker: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerActive: {
    color: '#000000',
  },

  // Slider labels
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 290,
  },
  label: {
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#555',
  },
  activeLabel: {
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },

  // Toggle Button
  toggleButtonContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Theme.colors.primary,
    width: '100%',
    height: 50
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  activeToggleButton: {
    backgroundColor: Theme.colors.primary,
  },
  inactiveToggleButton: {
    backgroundColor: 'white',
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: '#333',
  },

  // Consistency Chart
  backgroundThresholdBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#E4E4E4',
    borderRadius: 10,
    zIndex: 0,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 16,
    maxWidth: '95%',
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

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 30
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: Theme.colors.primary,
    borderColor: '#2e86de',
  },

  // Baby SVG 
  SVGcontainer: {
    position: 'relative',
    margin: 0,
  },
  SVGoverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pressableContainer: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  //SETTINGS
  textField: {
    // Web 
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
    // iOS 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Android 
    elevation: 3,
    marginVertical: 10,
  },

  // Tutorial box
  tutorialBox: {
    borderRadius: 10,
    padding: 20
  }

});
