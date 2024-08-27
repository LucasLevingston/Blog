import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { registerUser, loginUser, deleteUser } from '../../controllers/userController';
import {
  createUserService,
  deleteUserService,
  getByUsername,
  loginUserService,
} from '../../services/userService';
import { FastifyRequest, FastifyReply } from 'fastify';

// Mocks
vi.mock('../../services/userService');

let id: string;

describe('UserController', () => {
  const mockReply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      (getByUsername as Mock).mockResolvedValue(null);
      (createUserService as Mock).mockResolvedValue({
        id: 'mock-id',
        username: 'testuser',
        email: 'test@example.com',
      });

      const mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
          email: 'test@example.com',
        },
      } as FastifyRequest<{
        Body: { username: string; password: string; email: string };
      }>;

      await registerUser(mockRequest, mockReply);

      // id = mockReply.send;

      expect(getByUsername).toHaveBeenCalledWith('testuser');
      expect(createUserService).toHaveBeenCalledWith(
        'testuser',
        'password123',
        'test@example.com'
      );
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        id: 'mock-id',
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should return 500 if user already exists', async () => {
      (getByUsername as Mock).mockResolvedValue({
        id: 'mock-id',
        username: 'testuser',
        email: 'test@example.com',
      });

      const mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
          email: 'test@example.com',
        },
      } as FastifyRequest<{
        Body: { username: string; password: string; email: string };
      }>;

      await registerUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      const mockUser = {
        id: 'mock-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      (loginUserService as Mock).mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
      });

      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as FastifyRequest<{
        Body: { email: string; password: string };
      }>;

      await loginUser(mockRequest, mockReply);

      expect(loginUserService).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        user: mockUser,
        token: 'mock-token',
      });
    });

    it('should return 400 if email is missing', async () => {
      const mockRequest = {
        body: {
          password: 'password123',
        },
      } as FastifyRequest<{
        Body: { email: string; password: string };
      }>;

      await loginUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Email is required.' });
    });

    it('should return 500 on login service failure', async () => {
      (loginUserService as Mock).mockRejectedValue(new Error('Login failed'));

      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as FastifyRequest<{
        Body: { email: string; password: string };
      }>;

      await loginUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      (deleteUserService as Mock).mockResolvedValue(undefined);

      const mockRequest = {
        params: {
          id: 'mock-id',
        },
      } as FastifyRequest<{
        Params: { id: string };
      }>;

      await deleteUser(mockRequest, mockReply);

      expect(deleteUserService).toHaveBeenCalledWith('mock-id');
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith();
    });

    it('should return 404 if user is not found', async () => {
      (deleteUserService as Mock).mockRejectedValue(new Error('User not found'));

      const mockRequest = {
        params: {
          id: 'mock-id',
        },
      } as FastifyRequest<{
        Params: { id: string };
      }>;

      await deleteUser(mockRequest, mockReply);

      expect(deleteUserService).toHaveBeenCalledWith('mock-id');
      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
