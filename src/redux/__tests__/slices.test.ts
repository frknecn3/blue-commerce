import { describe, it, expect } from 'vitest';
import uiSlice, {
  openCartModal,
  closeCartModal,
  toggleCartModal,
  toggleTheme,
  onboardingNextStep,
  onboardingPrevStep,
  onboardingSetStep,
  onboardingAddData,
  openAdminSidebar,
  closeAdminSidebar,
  toggleAdminSidebar,
} from '../slices/uiSlice';
import favoriteSlice from '../slices/favoriteSlice';

describe('Redux Toolkit Slices Unit Tests', () => {
  describe('uiSlice reducers', () => {
    const getInitialState = () => uiSlice.reducer(undefined, { type: '@@INIT' });

    it('should initialize with default state', () => {
      const state = getInitialState();
      expect(state.cartModalOpen).toBe(false);
      expect(state.adminSidebarOpen).toBe(true);
      expect(state.onboardingStep).toBe(1);
      expect(state.theme).toBe('light');
    });

    it('handles openCartModal, closeCartModal, and toggleCartModal', () => {
      let state = getInitialState();

      state = uiSlice.reducer(state, openCartModal());
      expect(state.cartModalOpen).toBe(true);

      state = uiSlice.reducer(state, closeCartModal());
      expect(state.cartModalOpen).toBe(false);

      state = uiSlice.reducer(state, toggleCartModal());
      expect(state.cartModalOpen).toBe(true);

      state = uiSlice.reducer(state, toggleCartModal());
      expect(state.cartModalOpen).toBe(false);
    });

    it('handles toggleTheme between light and dark', () => {
      let state = getInitialState();
      expect(state.theme).toBe('light');

      state = uiSlice.reducer(state, toggleTheme());
      expect(state.theme).toBe('dark');

      state = uiSlice.reducer(state, toggleTheme());
      expect(state.theme).toBe('light');
    });

    it('handles onboarding step navigation and data updates', () => {
      let state = getInitialState();

      state = uiSlice.reducer(state, onboardingNextStep());
      expect(state.onboardingStep).toBe(2);

      state = uiSlice.reducer(state, onboardingPrevStep());
      expect(state.onboardingStep).toBe(1);

      state = uiSlice.reducer(state, onboardingSetStep(3));
      expect(state.onboardingStep).toBe(3);

      state = uiSlice.reducer(state, onboardingAddData({ email: 'test@example.com', name: 'Tester' }));
      expect(state.onboardingData).toEqual({ email: 'test@example.com', name: 'Tester' });

      state = uiSlice.reducer(state, onboardingAddData({ country: 'TR' }));
      expect(state.onboardingData).toEqual({ email: 'test@example.com', name: 'Tester', country: 'TR' });
    });

    it('handles admin sidebar controls', () => {
      let state = getInitialState();

      state = uiSlice.reducer(state, closeAdminSidebar());
      expect(state.adminSidebarOpen).toBe(false);

      state = uiSlice.reducer(state, openAdminSidebar());
      expect(state.adminSidebarOpen).toBe(true);

      state = uiSlice.reducer(state, toggleAdminSidebar());
      expect(state.adminSidebarOpen).toBe(false);
    });
  });

  describe('favoriteSlice adapter reducers', () => {
    it('initializes with empty entity adapter state', () => {
      const state = favoriteSlice.reducer(undefined, { type: '@@INIT' });
      expect(state.ids).toEqual([]);
      expect(state.entities).toEqual({});
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });
});
