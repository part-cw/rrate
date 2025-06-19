import { StyleSheet } from 'react-native';
import { Theme } from './theme';

export const GlobalStyles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 15,
  },

  innerContainer: {
    width: '100%',
    maxWidth: 500,
  },

  componentContainer: {
    marginVertical: 10,
  },
  floatingContainer: {
    // padding: 20,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: "#f5f6f7",
    width: '100%',
    maxWidth: 500,

    // iOS 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android 
    elevation: 5,
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
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 20,
    elevation: 4, // Android shadow
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
    height: 2,
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
    width: 250,

  },
  sliderLine: {
    height: 2,
    backgroundColor: 'black',
    width: 250,
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
    marginTop: 20,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
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
  },
  checkbox: {
    height: 22,
    width: 22,
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
    // width: 320,
    // height: 350,
    position: 'relative',
    margin: 0,
  },
  SVGoverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

});
