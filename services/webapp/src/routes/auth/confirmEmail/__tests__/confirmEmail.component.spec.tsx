import React from 'react';

import { waitFor, screen } from '@testing-library/react';
import { makeContextRenderer, spiedHistory } from '../../../../shared/utils/testUtils';
import { ConfirmEmail } from '../confirmEmail.component';
import { ROUTES } from '../../../app.constants';
import { confirmEmail } from '../../../../modules/auth/auth.actions';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual<NodeModule>('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

const user = 'user_id';
const token = 'token';
const confirmTokenRoute = `/en/auth/confirm/${user}/${token}`;
const confirmTokenRouteNoToken = `/en/auth/confirm`;

describe('ConfirmEmail: Component', () => {
  const component = () => <ConfirmEmail />;
  const render = makeContextRenderer(component);

  beforeEach(() => {
    mockDispatch.mockReset();
  });

  it('should call confirm token action', async () => {
    mockDispatch.mockResolvedValue({ isError: false });
    render({}, { router: { url: confirmTokenRoute, routePath: `/:lang${ROUTES.confirmEmail}` } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(confirmEmail({ token, user }));
    });
  });

  it('should hide token and user from URL', async () => {
    mockDispatch.mockResolvedValue({
      isError: false,
    });
    const { pushSpy, history } = spiedHistory(confirmTokenRoute);
    render({}, { router: { history, routePath: `/:lang${ROUTES.confirmEmail}` } });
    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith('/en/auth/confirm');
    });
  });

  describe('token is invalid', () => {
    it('should show invalid token error', async () => {
      mockDispatch.mockResolvedValue({
        isError: true,
      });
      const { history } = spiedHistory(confirmTokenRoute);
      render({}, { router: { history, routePath: `/:lang${ROUTES.confirmEmail}` } });
      await waitFor(() => {
        expect(screen.getByText('Invalid token')).toBeInTheDocument();
      });
    });
  });

  describe('token is valid', () => {
    it('should not show invalid token error', async () => {
      mockDispatch.mockResolvedValue({
        isError: false,
      });
      const { history } = spiedHistory(confirmTokenRoute);
      render({}, { router: { history, routePath: `/:lang${ROUTES.confirmEmail}` } });
      await waitFor(() => {
        expect(screen.queryByText('Invalid token')).not.toBeInTheDocument();
      });
    });
  });

  describe('token is missing from URL', () => {
    it('should show invalid token error', async () => {
      const { history } = spiedHistory(confirmTokenRouteNoToken);
      render({}, { router: { history, routePath: `/:lang${ROUTES.confirmEmail}` } });
      await waitFor(() => {
        expect(screen.getByText('Invalid token')).toBeInTheDocument();
      });
    });
  });
});