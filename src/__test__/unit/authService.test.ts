// unit/authService.test.ts
import { login, logout } from '../../service/authService'; // Adjust the path as necessary
import { Request, Response } from 'express';

describe('Auth Service Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        username: 'admin123',
        password: 'admin123',
      },
      cookies: {
        isAuthenticated: 'false',
      },
    };
    
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows chaining
    };
  });

  describe('login', () => {
    it('should return a success message when credentials are correct', () => {
      login(req as Request, res as Response);
      expect(res.cookie).toHaveBeenCalledWith('isAuthenticated', 'true', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ message: 'Login Berhasil' });
    });

    it('should return an error message for incorrect username', () => {
      req.body.username = 'wrongUsername';
      login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username atau password tidak valid' });
    });

    it('should return an error message for incorrect password', () => {
      req.body.password = 'wrongPassword';
      login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username atau password tidak valid' });
    });

    it('should return an error message when no username or password is provided', () => {
      req.body.username = '';
      req.body.password = '';
      login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Harus input username dan password' });
    });
  });

  describe('logout', () => {
    it('should clear the authentication cookie and return a success message', () => {
      logout(req as Request, res as Response);
      expect(res.clearCookie).toHaveBeenCalledWith('isAuthenticated', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout Berhasil' });
    });
  });
});
