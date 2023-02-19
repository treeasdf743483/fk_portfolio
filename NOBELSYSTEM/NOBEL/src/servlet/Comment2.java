package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import form.InputForm;

/**
 * Servlet implementation class Comment2
 */
@WebServlet("/Comment2")
public class Comment2 extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public Comment2() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


		// TODO Auto-generated method stub
				response.setContentType("text/html;charset=UTF-8");
				request.setCharacterEncoding("UTF-8");
				doGet(request, response);
				String thema = "";
				String detail = "";
				String basis = "";
				String commentIn = "";
				String[] commentArr = new String[10000];
				int i  = 0;
				int cnt;
				int cntThema;


				InputForm nobelForm = new InputForm();
				//入力値を取得
				thema = (String) (request.getParameter("thoery"));
				commentIn = (String) (request.getParameter("comment"));

				System.out.println(thema);
				cnt = Integer.parseInt((request.getParameter("cnt")));
				cntThema = Integer.parseInt((request.getParameter("cntThema")));
				System.out.println(cnt);


				HttpSession session = request.getSession();


				//�R�l�N�V����
				Connection conn = null;

				//�X�e�[�g�����g
				PreparedStatement ps = null;

				//���U���g�Z�b�g
				ResultSet rs = null;

				try {



					// 先程インストールしたMySQLのドライバを指定
					Class.forName("com.mysql.cj.jdbc.Driver");

					//Oracle�ɐڑ�
					conn = DriverManager.getConnection("jdbc:mysql://localhost/NOBELDB", "joilyd4023", "adlf102");
					StringBuffer sqlBuffer = new StringBuffer();

					String sqlInsert = "insert into comment_t  values(?,?,?,?);";



					//実行するSQL文とパラメータを指定する
		            ps = conn.prepareStatement(sqlInsert);
		            ps.setInt(1, 1000 + cntThema);
		            ps.setString(2, thema);
		            ps.setInt(3, 1000 + cnt);
		            ps.setString(4, commentIn);


					//String sql = "SELECT thema FROM theory_T";
					int num = ps.executeUpdate();


					Statement stmt = conn.createStatement();

					String sql = "select comment from comment_T where theory = ? order by commentNo";

					ps = conn.prepareStatement(sql);


						ps.setString(1, thema);


					rs = ps.executeQuery();


		            System.out.println(thema);

					while (rs.next()) {
						commentArr[i] = rs.getString("comment");
						i++;
					}




					//Result���N���[�Y
					ps.close();





					InputForm inputForm = new InputForm();
					inputForm.setThema(thema);
					request.setAttribute("inputForm", inputForm);
					request.setAttribute("theory", thema);
					request.setAttribute("commentArr", commentArr);
					request.setAttribute("cntThema", cntThema);
					request.setAttribute("cnt", cnt+1);

					RequestDispatcher rd = request.getRequestDispatcher("/pages/comment.jsp");

					rd.forward(request, response);
				} catch (Exception x) {
					x.printStackTrace();
					RequestDispatcher rd = request.getRequestDispatcher("/pages/comment.jsp");

					rd.forward(request, response);


				} finally {
					try {
						if (rs != null) {
							//ResultSet���N���[�Y
							rs.close();
						}
						if (ps != null) {
							//Statement���N���[�Y
							ps.close();
						}
						//connection���N���[�Y
						conn.close();

					} catch (Exception e) {
						e.printStackTrace();
					}

				}

	}

}
